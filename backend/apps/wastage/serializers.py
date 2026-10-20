from rest_framework import serializers
from .models import WastageLog


class WastageLogSerializer(serializers.ModelSerializer):
    batch_number = serializers.CharField(source="batch.batch_number", read_only=True)
    item_name = serializers.CharField(source="batch.item.name", read_only=True)

    class Meta:
        model = WastageLog
        fields = [
            "id",
            "batch",
            "batch_number",
            "item_name",
            "quantity_lost",
            "financial_loss",
            "reason",
            "logged_by",
            "created_at",
        ]
        read_only_fields = ["id", "logged_by", "created_at"]
