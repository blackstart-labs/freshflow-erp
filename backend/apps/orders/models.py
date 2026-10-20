import uuid
from decimal import Decimal
from django.db import models
from apps.crm.models import Restaurant
from apps.inventory.models import PerishableItem, StockBatch


class OrderStatus(models.TextChoices):
    PENDING = "PENDING", "Pending Allocation"
    ALLOCATED = "ALLOCATED", "Allocated (FEFO Locked)"
    DISPATCHED = "DISPATCHED", "Dispatched in Cold Transit"
    DELIVERED = "DELIVERED", "Delivered & Accepted"
    CANCELLED = "CANCELLED", "Cancelled"


def generate_order_number() -> str:
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"


class Order(models.Model):
    order_number = models.CharField(
        max_length=32,
        unique=True,
        default=generate_order_number,
        db_index=True,
    )
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name="orders",
    )
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        db_index=True,
    )
    subtotal_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    tier_discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    discount_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order_number} - {self.restaurant.business_name} ({self.status})"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )
    item = models.ForeignKey(
        PerishableItem,
        on_delete=models.PROTECT,
        related_name="order_items",
    )
    batch = models.ForeignKey(
        StockBatch,
        on_delete=models.PROTECT,
        related_name="allocated_order_items",
        null=True,
        blank=True,
    )
    quantity_ordered = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.order.order_number}: {self.quantity_ordered}x {self.item.name}"
