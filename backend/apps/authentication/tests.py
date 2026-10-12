from django.contrib.auth import get_user_model
from django.test import TestCase

User = get_user_model()


class AuthenticationSmokeTest(TestCase):
    def test_user_model_configured(self):
        self.assertEqual(User.__name__, "User")
