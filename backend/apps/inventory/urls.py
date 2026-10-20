from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import PerishableItemViewSet, StockBatchViewSet

router = DefaultRouter()
router.register(r"items", PerishableItemViewSet, basename="perishable-item")
router.register(r"batches", StockBatchViewSet, basename="stock-batch")

app_name = "inventory"

urlpatterns = [
    path("", include(router.urls)),
]
