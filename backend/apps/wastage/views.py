from rest_framework import viewsets
from apps.authentication.permissions import IsWarehouseManager
from .models import WastageLog
from .serializers import WastageLogSerializer


class WastageLogViewSet(viewsets.ModelViewSet):
    queryset = WastageLog.objects.select_related("batch__item", "logged_by").all().order_by("-created_at")
    serializer_class = WastageLogSerializer
    permission_classes = [IsWarehouseManager]
    filterset_fields = ["reason"]

    def perform_create(self, serializer):
        serializer.save(logged_by=self.request.user)
