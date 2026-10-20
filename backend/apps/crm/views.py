from rest_framework import viewsets
from apps.authentication.permissions import IsSalesAgent
from .models import Restaurant
from .serializers import RestaurantSerializer


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.select_related("user").all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsSalesAgent]
    search_fields = ["business_name", "trade_license_no"]
    filterset_fields = ["tier"]
