from rest_framework import serializers
from .models import PerishableItem, StockBatch


class PerishableItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerishableItem
        fields = [
            "id",
            "name",
            "category",
            "required_temp_celsius",
            "temp_tolerance_celsius",
            "standard_shelf_life_days",
            "unit_of_measure",
            "created_at",
        ]


class StockBatchSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.name", read_only=True)
    item_category = serializers.CharField(source="item.category", read_only=True)
    remaining_days = serializers.IntegerField(read_only=True)
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = StockBatch
        fields = [
            "id",
            "batch_number",
            "item",
            "item_name",
            "item_category",
            "harvest_pack_date",
            "expiry_date",
            "initial_quantity",
            "current_quantity",
            "purchase_cost",
            "base_selling_price",
            "status",
            "storage_bin",
            "remaining_days",
            "effective_price",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        if attrs.get("current_quantity", 0) > attrs.get("initial_quantity", attrs.get("current_quantity", 0)):
            raise serializers.ValidationError("Current quantity cannot exceed initial quantity.")
        if attrs.get("initial_quantity", 1) <= 0:
            raise serializers.ValidationError("Initial quantity must be strictly greater than 0.")
        return attrs
