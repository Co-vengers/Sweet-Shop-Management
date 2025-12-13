"""
Custom Authentication Backend
Allows users to login with email instead of username
"""

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailBackend(ModelBackend):
    """
    Authenticate using email instead of username
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Try to find user by email (username parameter contains email)
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return None
        
        # Check password
        if user.check_password(password):
            return user
        return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None