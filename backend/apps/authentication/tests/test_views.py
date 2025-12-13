"""
Tests for Authentication API Endpoints
"""

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestRegistration:
    """Test user registration endpoint"""
    
    def setup_method(self):
        """
        This runs before each test
        Sets up the test client and URLs
        """
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
    
    def test_register_user_success(self):
        """
        Test successful user registration
        Should return 201 status and JWT tokens
        """
        # Arrange: Prepare test data
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'SecurePass123!',
            'password2': 'SecurePass123!'
        }
        
        # Act: Make POST request to register endpoint
        response = self.client.post(self.register_url, data, format='json')
        
        # Assert: Check response
        assert response.status_code == status.HTTP_201_CREATED
        assert 'access' in response.data  # Should have access token
        assert 'refresh' in response.data  # Should have refresh token
        assert 'user' in response.data  # Should have user data
        
        # Verify user was created in database
        assert User.objects.filter(email='newuser@example.com').exists()
    
    def test_register_with_mismatched_passwords(self):
        """
        Test registration with passwords that don't match
        Should return 400 error
        """
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'SecurePass123!',
            'password2': 'DifferentPass123!'  # Different password
        }
        
        response = self.client.post(self.register_url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_with_existing_email(self):
        """
        Test registration with email that already exists
        Should return 400 error
        """
        # Create a user first
        User.objects.create_user(
            email='existing@example.com',
            username='existing',
            password='pass123'
        )
        
        # Try to create another user with same email
        data = {
            'email': 'existing@example.com',
            'username': 'newuser',
            'password': 'SecurePass123!',
            'password2': 'SecurePass123!'
        }
        
        response = self.client.post(self.register_url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_with_short_password(self):
        """
        Test registration with too short password
        Should return 400 error
        """
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': '123',  # Too short
            'password2': '123'
        }
        
        response = self.client.post(self.register_url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLogin:
    """Test user login endpoint"""
    
    def setup_method(self):
        """Setup runs before each test"""
        self.client = APIClient()
        self.login_url = '/api/auth/login/'
        
        # Create a test user
        self.user = User.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='TestPass123!'
        )
    
    def test_login_success(self):
        """
        Test successful login
        Should return access and refresh tokens
        """
        data = {
            'email': 'testuser@example.com',
            'password': 'TestPass123!'
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
    
    def test_login_with_wrong_password(self):
        """
        Test login with incorrect password
        Should return 401 error
        """
        data = {
            'email': 'testuser@example.com',
            'password': 'WrongPassword123!'
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_login_with_nonexistent_email(self):
        """
        Test login with email that doesn't exist
        Should return 401 error
        """
        data = {
            'email': 'nonexistent@example.com',
            'password': 'SomePass123!'
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED