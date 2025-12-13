"""
Test for User Model
This file tests if our custom User model works correctly
"""

import pytest
from django.contrib.auth import get_user_model

# Get our custom User model
User = get_user_model()


@pytest.mark.django_db  # This tells pytest to use the database
class TestUserModel:
    """Test cases for User model"""
    
    def test_create_user_with_email(self):
        """
        Test that we can create a user with email and password
        This should work for regular users
        """
        # Arrange: Set up test data
        email = "test@example.com"
        password = "testpass123"
        username = "testuser"
        
        # Act: Create the user
        user = User.objects.create_user(
            email=email,
            password=password,
            username=username
        )
        
        # Assert: Check if everything worked
        assert user.email == email
        assert user.username == username
        assert user.check_password(password) is True  # Password should be hashed
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False
    
    def test_create_user_without_email_raises_error(self):
        """
        Test that creating a user without email raises an error
        """
        with pytest.raises(ValueError):
            User.objects.create_user(
                email="",
                password="testpass123",
                username="testuser"
            )
    
    def test_create_superuser(self):
        """
        Test creating an admin user (superuser)
        """
        # Arrange
        email = "admin@example.com"
        password = "adminpass123"
        username = "admin"
        
        # Act
        admin = User.objects.create_superuser(
            email=email,
            password=password,
            username=username
        )
        
        # Assert
        assert admin.is_staff is True
        assert admin.is_superuser is True
        assert admin.is_active is True