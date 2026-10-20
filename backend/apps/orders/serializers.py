from decimal import Decimal
from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.name", read_only=True)
    batch_number = serializers.CharField(source="batch.batch_number", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "item",
            "item_name",
            "batch",
            "batch_number",
            "quantity_ordered",
            "unit_price",
            "subtotal",
        ]
        read_only_fields = ["id", "batch", "batch_number", "unit_price", "subtotal"]


class OrderItemCreateInputSerializer(serializers.Serializer):
    item_id = serializers.IntegerField(min_value=1)
    quantity = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal("0.01"))


class OrderCreateSerializer(serializers.Serializer):
    restaurant_id = serializers.IntegerField(required=False)
    items = OrderItemCreateInputSerializer(many=True, allow_empty=False)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source="restaurant.business_name", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "restaurant",
            "restaurant_name",
            "status",
            "subtotal_amount",
            "tier_discount_percent",
            "discount_amount",
            "total_amount",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "order_number",
            "status",
            "subtotal_amount",
            "tier_discount_percent",
            "discount_amount",
            "total_amount",
            "created_at",
            "updated_at",
        ]
