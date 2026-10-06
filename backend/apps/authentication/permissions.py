"""
FreshFlow ERP — RBAC Custom Permission Classes
Enforces server-side zero-trust authorization based on User.role.
"""

from rest_framework.permissions import BasePermission
from .models import UserRole


class IsAdminRole(BasePermission):
    """Allows access only to users with the ADMIN role or superusers."""

    message = "Access restricted: requires Administrator role."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == UserRole.ADMIN or request.user.is_superuser)
        )


class IsWarehouseManager(BasePermission):
    """Allows access to Warehouse Managers and Administrators."""

    message = "Access restricted: requires Warehouse Manager or Admin role."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.role in [UserRole.WAREHOUSE_MANAGER, UserRole.ADMIN]
                or request.user.is_superuser
            )
        )


class IsSalesAgent(BasePermission):
    """Allows access to Sales Agents and Administrators."""

    message = "Access restricted: requires Sales Agent or Admin role."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.role in [UserRole.SALES_AGENT, UserRole.ADMIN]
                or request.user.is_superuser
            )
        )


class IsRestaurantClient(BasePermission):
    """Allows access only to authenticated Restaurant Client users."""

    message = "Access restricted: requires Restaurant Client account."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.RESTAURANT_CLIENT
        )


class IsStaffOrReadOnly(BasePermission):
    """Safe methods allowed for clients, modifications restricted to Warehouse/Admin staff."""

    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return bool(request.user and request.user.is_authenticated)
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.role in [UserRole.ADMIN, UserRole.WAREHOUSE_MANAGER]
                or request.user.is_superuser
            )
        )
