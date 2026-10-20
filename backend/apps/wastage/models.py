from decimal import Decimal
from django.conf import settings
from django.db import models
from apps.inventory.models import StockBatch


class WastageReason(models.TextChoices):
    EXPIRED = "EXPIRED", "Expired Shelf-Life"
    COLD_CHAIN_BREACH = "COLD_CHAIN_BREACH", "Cold Chain Temperature Breach"
    PHYSICAL_DAMAGE = "PHYSICAL_DAMAGE", "Physical Transit Damage"
    QUALITY_REJECT = "QUALITY_REJECT", "Client Quality Rejection"


class WastageLog(models.Model):
    batch = models.ForeignKey(
        StockBatch,
        on_delete=models.CASCADE,
        related_name="wastage_logs",
    )
    quantity_lost = models.DecimalField(max_digits=12, decimal_places=2)
    financial_loss = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.CharField(
        max_length=30,
        choices=WastageReason.choices,
        default=WastageReason.EXPIRED,
        db_index=True,
    )
    logged_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="logged_wastages",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Wastage #{self.id}: {self.quantity_lost} {self.batch.item.unit_of_measure} ({self.reason}) - ${self.financial_loss}"
