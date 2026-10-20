from django.urls import path
from .views import DashboardKPIView

app_name = "analytics"

urlpatterns = [
    path("kpis/", DashboardKPIView.as_view(), name="dashboard-kpis"),
]
