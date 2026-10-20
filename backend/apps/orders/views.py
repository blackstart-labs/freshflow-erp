from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from apps.authentication.models import UserRole
from apps.crm.models import Restaurant
from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer
from .services import InsufficientStockError, OrderAllocationService


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Order.objects.select_related("restaurant").prefetch_related("items__item", "items__batch")
        if user.is_superuser or user.role in (UserRole.ADMIN, UserRole.WAREHOUSE_MANAGER, UserRole.SALES_AGENT):
            return qs.all()
        # Restaurant client only sees their restaurant's orders
        if hasattr(user, "restaurant"):
            return qs.filter(restaurant=user.restaurant)
        return qs.none()

    def create(self, request, *args, **kwargs):
        input_serializer = OrderCreateSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        user = request.user
        if hasattr(user, "restaurant"):
            restaurant = user.restaurant
        else:
            restaurant_id = data.get("restaurant_id")
            if not restaurant_id:
                return Response(
                    {"error": "Staff users must supply 'restaurant_id' to create an order."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            try:
                restaurant = Restaurant.objects.get(id=restaurant_id)
            except Restaurant.DoesNotExist:
                return Response(
                    {"error": f"Restaurant with id {restaurant_id} does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        try:
            order = OrderAllocationService.create_order_with_fefo_allocation(
                restaurant=restaurant,
                items_payload=data["items"],
            )
            output_serializer = OrderSerializer(order)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)
        except InsufficientStockError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
