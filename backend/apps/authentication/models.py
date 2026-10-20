from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Administrator"
    WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER", "Warehouse Manager"
    SALES_AGENT = "SALES_AGENT", "Sales Agent"
    RESTAURANT_CLIENT = "RESTAURANT_CLIENT", "Restaurant Client"


class User(AbstractUser):
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.RESTAURANT_CLIENT,
        db_index=True,
    )
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def is_admin_role(self) -> bool:
        return self.role == UserRole.ADMIN or self.is_superuser

    def is_warehouse_role(self) -> bool:
        return self.role in (UserRole.WAREHOUSE_MANAGER, UserRole.ADMIN) or self.is_superuser

    def is_sales_role(self) -> bool:
        return self.role in (UserRole.SALES_AGENT, UserRole.ADMIN) or self.is_superuser

    def is_client_role(self) -> bool:
        return self.role == UserRole.RESTAURANT_CLIENT

    def __str__(self):
        return f"{self.username} ({self.role})"
