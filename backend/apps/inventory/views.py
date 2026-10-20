from rest_framework import viewsets
from apps.authentication.permissions import IsStaffOrReadOnly
from .models import PerishableItem, StockBatch
from .serializers import PerishableItemSerializer, StockBatchSerializer


class PerishableItemViewSet(viewsets.ModelViewSet):
    queryset = PerishableItem.objects.all()
    serializer_class = PerishableItemSerializer
    permission_classes = [IsStaffOrReadOnly]
    search_fields = ["name", "category"]


class StockBatchViewSet(viewsets.ModelViewSet):
    queryset = StockBatch.objects.select_related("item").all().order_by("expiry_date")
    serializer_class = StockBatchSerializer
    permission_classes = [IsStaffOrReadOnly]
    filterset_fields = ["status", "item"]
    search_fields = ["batch_number", "item__name"]
