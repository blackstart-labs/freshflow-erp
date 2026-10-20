from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.authentication.models import UserRole
from apps.authentication.permissions import (
    IsAdminRole,
    IsRestaurantClient,
    IsSalesAgent,
    IsWarehouseManager,
)

User = get_user_model()


class AuthenticationModuleTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username="admin_test",
            email="admin@freshflow.io",
            password="StrongPassword123!",
            role=UserRole.ADMIN,
        )
        self.warehouse_user = User.objects.create_user(
            username="wh_test",
            email="wh@freshflow.io",
            password="StrongPassword123!",
            role=UserRole.WAREHOUSE_MANAGER,
        )
        self.sales_user = User.objects.create_user(
            username="sales_test",
            email="sales@freshflow.io",
            password="StrongPassword123!",
            role=UserRole.SALES_AGENT,
        )
        self.client_user = User.objects.create_user(
            username="bistro_test",
            email="bistro@restaurant.com",
            password="StrongPassword123!",
            role=UserRole.RESTAURANT_CLIENT,
        )

    def test_user_roles_and_helpers(self):
        self.assertTrue(self.admin_user.is_admin_role())
        self.assertTrue(self.warehouse_user.is_warehouse_role())
        self.assertTrue(self.sales_user.is_sales_role())
        self.assertTrue(self.client_user.is_client_role())
        self.assertFalse(self.client_user.is_admin_role())

    def test_jwt_token_obtain_and_claims(self):
        url = reverse("token_obtain_pair")
        payload = {"username": "admin_test", "password": "StrongPassword123!"}
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_custom_token_obtain_with_user_payload(self):
        url = reverse("auth_token_obtain")
        payload = {"username": "bistro_test", "password": "StrongPassword123!"}
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["role"], UserRole.RESTAURANT_CLIENT)
        self.assertEqual(response.data["user"]["username"], "bistro_test")

    def test_token_refresh_rotation(self):
        url = reverse("token_obtain_pair")
        response = self.client.post(url, {"username": "wh_test", "password": "StrongPassword123!"})
        refresh_token = response.data["refresh"]

        refresh_url = reverse("token_refresh")
        refresh_res = self.client.post(refresh_url, {"refresh": refresh_token})

        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_res.data)
        # Verify rotation provided new refresh token
        self.assertIn("refresh", refresh_res.data)
        self.assertNotEqual(refresh_token, refresh_res.data["refresh"])

    def test_token_blacklisting(self):
        url = reverse("token_obtain_pair")
        response = self.client.post(url, {"username": "sales_test", "password": "StrongPassword123!"})
        refresh_token = response.data["refresh"]

        # Blacklist the refresh token
        blacklist_url = reverse("token_blacklist")
        blacklist_res = self.client.post(blacklist_url, {"refresh": refresh_token})
        self.assertEqual(blacklist_res.status_code, status.HTTP_200_OK)

        # Attempt to use blacklisted refresh token - must fail 401
        refresh_url = reverse("token_refresh")
        fail_res = self.client.post(refresh_url, {"refresh": refresh_token})
        self.assertEqual(fail_res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_registration(self):
        url = reverse("auth_register")
        payload = {
            "username": "new_chef",
            "email": "chef@harvest.com",
            "password": "Password99!",
            "phone_number": "+1234567890",
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(username="new_chef")
        self.assertEqual(user.role, UserRole.RESTAURANT_CLIENT)
        self.assertEqual(user.phone_number, "+1234567890")

    def test_user_profile_authenticated(self):
        url = reverse("auth_profile")
        # Unauthenticated request fails
        unauth_res = self.client.get(url)
        self.assertEqual(unauth_res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticate
        self.client.force_authenticate(user=self.client_user)
        auth_res = self.client.get(url)
        self.assertEqual(auth_res.status_code, status.HTTP_200_OK)
        self.assertEqual(auth_res.data["username"], "bistro_test")
        self.assertEqual(auth_res.data["role"], UserRole.RESTAURANT_CLIENT)
