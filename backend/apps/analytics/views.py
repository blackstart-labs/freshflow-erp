from datetime import date, timedelta
from decimal import Decimal
from django.db.models import Sum
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.inventory.models import StockBatch, BatchStatus
from apps.orders.models import Order, OrderStatus
from apps.wastage.models import WastageLog


class DashboardKPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        markdown_cutoff = today + timedelta(days=2)

        active_cold_batches = StockBatch.objects.filter(
            status__in=[BatchStatus.AVAILABLE, BatchStatus.FLASH_SALE],
            current_quantity__gt=Decimal("0.00"),
        ).count()

        near_expiry_items = StockBatch.objects.filter(
            status__in=[BatchStatus.AVAILABLE, BatchStatus.FLASH_SALE],
            current_quantity__gt=Decimal("0.00"),
            expiry_date__lte=markdown_cutoff,
        ).count()

        revenue_agg = Order.objects.filter(
            status__in=[OrderStatus.ALLOCATED, OrderStatus.DISPATCHED, OrderStatus.DELIVERED]
        ).aggregate(total=Sum("total_amount"))
        total_revenue = float(revenue_agg["total"] or Decimal("0.00"))

        wastage_agg = WastageLog.objects.aggregate(total=Sum("financial_loss"))
        spoilage_loss = float(wastage_agg["total"] or Decimal("0.00"))

        data = {
            "active_cold_batches": active_cold_batches,
            "near_expiry_items": near_expiry_items,
            "total_revenue": total_revenue,
            "spoilage_loss": spoilage_loss,
        }
        return Response(data)
