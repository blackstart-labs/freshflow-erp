from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet

router = DefaultRouter()
router.register(r"restaurants", RestaurantViewSet, basename="restaurant")

app_name = "crm"

urlpatterns = [
    path("", include(router.urls)),
]
