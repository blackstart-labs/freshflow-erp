from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, UserRole


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["role"] = user.role
        token["email"] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user_data = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "role": self.user.role,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
        }
        if hasattr(self.user, "restaurant"):
            user_data["restaurant_id"] = self.user.restaurant.id
            user_data["tier"] = self.user.restaurant.tier
        data["user"] = user_data
        return data


class UserSerializer(serializers.ModelSerializer):
    restaurant_id = serializers.SerializerMethodField()
    tier = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "phone_number",
            "first_name",
            "last_name",
            "restaurant_id",
            "tier",
        ]
        read_only_fields = ["id", "role"]

    def get_restaurant_id(self, obj):
        return getattr(getattr(obj, "restaurant", None), "id", None)

    def get_tier(self, obj):
        return getattr(getattr(obj, "restaurant", None), "tier", None)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role", "phone_number"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        # Default role for public self-registration is RESTAURANT_CLIENT
        role = validated_data.get("role", UserRole.RESTAURANT_CLIENT)
        if role not in UserRole.values:
            role = UserRole.RESTAURANT_CLIENT
        validated_data["role"] = role
        user = User.objects.create_user(password=password, **validated_data)
        return user
