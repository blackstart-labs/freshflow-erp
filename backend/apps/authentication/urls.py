from django.urls import path
from .views import CustomTokenObtainPairView, RegisterView, UserProfileView

urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="auth_token_obtain"),
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("profile/", UserProfileView.as_view(), name="auth_profile"),
]
