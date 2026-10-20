from datetime import date, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.inventory.models import StockBatch, BatchStatus
from apps.wastage.models import WastageLog, WastageReason


class Command(BaseCommand):
    help = (
        "Evaluate perishable stock batch shelf-life: transitions batches with <= 2 days "
        "remaining to FLASH_SALE (30% markdown) and marks past-expiry batches as EXPIRED with wastage logs."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Simulate markdown transitions and expiry evaluations without saving to database.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        today = date.today()
        markdown_cutoff = today + timedelta(days=2)

        self.stdout.write(self.style.NOTICE(f"Running Cold Chain Shelf-Life Audit for date: {today}"))
        if dry_run:
            self.stdout.write(self.style.WARNING("Running in DRY-RUN mode. No database records will be modified."))

        markdown_count = 0
        expired_count = 0
        total_scrap_value = Decimal("0.00")

        with transaction.atomic():
            # 1. Near-Expiry Batches: remaining shelf life <= 2 days, still in future or today
            near_expiry_batches = StockBatch.objects.select_for_update().filter(
                status=BatchStatus.AVAILABLE,
                current_quantity__gt=Decimal("0.00"),
                expiry_date__lte=markdown_cutoff,
                expiry_date__gte=today,
            )

            for batch in near_expiry_batches:
                remaining = (batch.expiry_date - today).days
                self.stdout.write(
                    f"-> [MARKDOWN FLASH SALE] Batch {batch.batch_number} ({batch.item.name}): "
                    f"{remaining} days remaining (Exp: {batch.expiry_date}). Base: ${batch.base_selling_price} -> Flash: ${batch.base_selling_price * Decimal('0.70'):.2f}"
                )
                if not dry_run:
                    batch.status = BatchStatus.FLASH_SALE
                    batch.save(update_fields=["status", "updated_at"])
                markdown_count += 1

            # 2. Hard-Expired Batches: expiry_date < today
            hard_expired_batches = StockBatch.objects.select_for_update().filter(
                status__in=[BatchStatus.AVAILABLE, BatchStatus.FLASH_SALE],
                current_quantity__gt=Decimal("0.00"),
                expiry_date__lt=today,
            )

            for batch in hard_expired_batches:
                loss = (batch.current_quantity * batch.purchase_cost).quantize(Decimal("0.01"))
                total_scrap_value += loss
                self.stdout.write(
                    self.style.ERROR(
                        f"-> [EXPIRED SCRAP] Batch {batch.batch_number} ({batch.item.name}): "
                        f"Expired on {batch.expiry_date}. Qty: {batch.current_quantity}, Scrap Loss: ${loss}"
                    )
                )
                if not dry_run:
                    batch.status = BatchStatus.EXPIRED
                    batch.save(update_fields=["status", "updated_at"])

                    WastageLog.objects.create(
                        batch=batch,
                        quantity_lost=batch.current_quantity,
                        financial_loss=loss,
                        reason=WastageReason.EXPIRED,
                    )
                expired_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\nShelf-Life Evaluation Completed:\n"
                f"  - Flash Sale Markdowns Applied: {markdown_count}\n"
                f"  - Expired Batches Scrapped:     {expired_count}\n"
                f"  - Total Wastage Financial Loss: ${total_scrap_value:.2f}"
            )
        )
