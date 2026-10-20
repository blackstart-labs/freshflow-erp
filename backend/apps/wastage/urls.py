from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import WastageLogViewSet

router = DefaultRouter()
router.register(r"logs", WastageLogViewSet, basename="wastage-log")

app_name = "wastage"

urlpatterns = [
    path("", include(router.urls)),
]
