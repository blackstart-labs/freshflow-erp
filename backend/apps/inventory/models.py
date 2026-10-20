from datetime import date
from decimal import Decimal
from django.db import models


class ItemCategory(models.TextChoices):
    DAIRY = "DAIRY", "Dairy"
    MEAT_POULTRY = "MEAT_POULTRY", "Meat & Poultry"
    SEAFOOD = "SEAFOOD", "Seafood"
    PRODUCE = "PRODUCE", "Fresh Produce"
    FROZEN = "FROZEN", "Frozen Foods"
    BEVERAGES = "BEVERAGES", "Beverages"


class BatchStatus(models.TextChoices):
    AVAILABLE = "AVAILABLE", "Available"
    FLASH_SALE = "FLASH_SALE", "Flash Sale (Markdown)"
    EXPIRED = "EXPIRED", "Expired"
    DEPLETED = "DEPLETED", "Depleted"


class PerishableItem(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    category = models.CharField(
        max_length=30,
        choices=ItemCategory.choices,
        default=ItemCategory.PRODUCE,
        db_index=True,
    )
    required_temp_celsius = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Target storage temperature in Celsius.",
    )
    temp_tolerance_celsius = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=Decimal("1.00"),
        help_text="Allowed temperature drift +/- in Celsius.",
    )
    standard_shelf_life_days = models.PositiveIntegerField(
        help_text="Expected shelf-life in days under optimal cold-chain storage.",
    )
    unit_of_measure = models.CharField(
        max_length=20,
        default="kg",
        help_text="e.g. kg, liter, crate, unit",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.category})"


class StockBatch(models.Model):
    batch_number = models.CharField(max_length=64, unique=True, db_index=True)
    item = models.ForeignKey(
        PerishableItem,
        on_delete=models.CASCADE,
        related_name="batches",
    )
    harvest_pack_date = models.DateField()
    expiry_date = models.DateField(db_index=True)
    initial_quantity = models.DecimalField(max_digits=12, decimal_places=2)
    current_quantity = models.DecimalField(max_digits=12, decimal_places=2)
    purchase_cost = models.DecimalField(max_digits=10, decimal_places=2)
    base_selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=BatchStatus.choices,
        default=BatchStatus.AVAILABLE,
        db_index=True,
    )
    storage_bin = models.CharField(max_length=50, default="COLD-ZONE-A1")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["expiry_date", "batch_number"]
        indexes = [
            models.Index(fields=["item", "status", "expiry_date"]),
        ]

    @property
    def remaining_days(self) -> int:
        return (self.expiry_date - date.today()).days

    @property
    def effective_price(self) -> Decimal:
        """Apply 30% markdown discount if batch is in FLASH_SALE status."""
        if self.status == BatchStatus.FLASH_SALE:
            return (self.base_selling_price * Decimal("0.70")).quantize(Decimal("0.01"))
        return self.base_selling_price

    def __str__(self):
        return f"{self.batch_number} - {self.item.name} (Exp: {self.expiry_date})"
