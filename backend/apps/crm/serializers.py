from rest_framework import serializers
from .models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    tier_discount_percentage = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Restaurant
        fields = [
            "id",
            "business_name",
            "trade_license_no",
            "user",
            "tier",
            "tier_discount_percentage",
            "total_spent_last_3_months",
            "credit_limit",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "tier_discount_percentage", "created_at", "updated_at"]
