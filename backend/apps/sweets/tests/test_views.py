"""
Tests for Sweet API Endpoints
"""

import pytest
from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.sweets.models import Sweet

User = get_user_model()


@pytest.mark.django_db
class TestSweetListEndpoint:
    """Test GET /api/sweets/ - List all sweets"""
    
    def setup_method(self):
        """Setup test client and create test user"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpass123'
        )
        self.url = '/api/sweets/'
    
    def test_list_sweets_authenticated(self):
        """
        Test that authenticated users can list sweets
        """
        # Create test sweets
        Sweet.objects.create(name="Sweet 1", category="Chocolate", price=Decimal("2.00"), quantity=10)
        Sweet.objects.create(name="Sweet 2", category="Gummy", price=Decimal("1.50"), quantity=5)
        
        # Authenticate
        self.client.force_authenticate(user=self.user)
        
        # Make request
        response = self.client.get(self.url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
    
    def test_list_sweets_unauthenticated(self):
        """
        Test that unauthenticated users cannot list sweets
        """
        response = self.client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestSweetCreateEndpoint:
    """Test POST /api/sweets/ - Create a new sweet"""
    
    def setup_method(self):
        """Setup test client and users"""
        self.client = APIClient()
        
        # Regular user
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user',
            password='pass123'
        )
        
        # Admin user
        self.admin = User.objects.create_user(
            email='admin@example.com',
            username='admin',
            password='admin123',
            is_admin=True
        )
        
        self.url = '/api/sweets/'
    
    def test_create_sweet_as_admin(self):
        """
        Test that admin users can create sweets
        """
        self.client.force_authenticate(user=self.admin)
        
        data = {
            'name': 'New Chocolate',
            'category': 'Chocolate',
            'price': '2.50',
            'quantity': 100,
            'description': 'Delicious chocolate'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'New Chocolate'
        assert Sweet.objects.filter(name='New Chocolate').exists()
    
    def test_create_sweet_as_regular_user_forbidden(self):
        """
        Test that regular users cannot create sweets
        """
        self.client.force_authenticate(user=self.user)
        
        data = {
            'name': 'New Chocolate',
            'category': 'Chocolate',
            'price': '2.50',
            'quantity': 100
        }
        
        response = self.client.post(self.url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_create_sweet_with_invalid_data(self):
        """
        Test creating sweet with invalid data
        """
        self.client.force_authenticate(user=self.admin)
        
        data = {
            'name': '',  # Empty name
            'category': 'Chocolate',
            'price': '-2.50',  # Negative price
            'quantity': -10  # Negative quantity
        }
        
        response = self.client.post(self.url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestSweetDetailEndpoint:
    """Test GET /api/sweets/:id/ - Get single sweet"""
    
    def setup_method(self):
        """Setup test data"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user',
            password='pass123'
        )
        
        self.sweet = Sweet.objects.create(
            name="Test Sweet",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=10
        )
    
    def test_get_sweet_detail_authenticated(self):
        """
        Test getting sweet details when authenticated
        """
        self.client.force_authenticate(user=self.user)
        
        url = f'/api/sweets/{self.sweet.id}/'
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Test Sweet'
        assert response.data['id'] == self.sweet.id
    
    def test_get_nonexistent_sweet(self):
        """
        Test getting a sweet that doesn't exist
        """
        self.client.force_authenticate(user=self.user)
        
        url = '/api/sweets/99999/'
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestSweetUpdateEndpoint:
    """Test PUT /api/sweets/:id/ - Update a sweet"""
    
    def setup_method(self):
        """Setup test data"""
        self.client = APIClient()
        
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user',
            password='pass123'
        )
        
        self.admin = User.objects.create_user(
            email='admin@example.com',
            username='admin',
            password='admin123',
            is_admin=True
        )
        
        self.sweet = Sweet.objects.create(
            name="Old Name",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=10
        )
    
    def test_update_sweet_as_admin(self):
        """
        Test that admin can update sweet
        """
        self.client.force_authenticate(user=self.admin)
        
        url = f'/api/sweets/{self.sweet.id}/'
        data = {
            'name': 'Updated Name',
            'category': 'Gummy',
            'price': '3.00',
            'quantity': 20
        }
        
        response = self.client.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Updated Name'
        
        # Verify database was updated
        self.sweet.refresh_from_db()
        assert self.sweet.name == 'Updated Name'
        assert self.sweet.price == Decimal('3.00')
    
    def test_update_sweet_as_regular_user_forbidden(self):
        """
        Test that regular users cannot update sweets
        """
        self.client.force_authenticate(user=self.user)
        
        url = f'/api/sweets/{self.sweet.id}/'
        data = {
            'name': 'Updated Name',
            'category': 'Gummy',
            'price': '3.00',
            'quantity': 20
        }
        
        response = self.client.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestSweetDeleteEndpoint:
    """Test DELETE /api/sweets/:id/ - Delete a sweet"""
    
    def setup_method(self):
        """Setup test data"""
        self.client = APIClient()
        
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user',
            password='pass123'
        )
        
        self.admin = User.objects.create_user(
            email='admin@example.com',
            username='admin',
            password='admin123',
            is_admin=True
        )
        
        self.sweet = Sweet.objects.create(
            name="To Delete",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=10
        )
    
    def test_delete_sweet_as_admin(self):
        """
        Test that admin can delete sweet
        """
        self.client.force_authenticate(user=self.admin)
        
        url = f'/api/sweets/{self.sweet.id}/'
        response = self.client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Sweet.objects.filter(id=self.sweet.id).exists()
    
    def test_delete_sweet_as_regular_user_forbidden(self):
        """
        Test that regular users cannot delete sweets
        """
        self.client.force_authenticate(user=self.user)
        
        url = f'/api/sweets/{self.sweet.id}/'
        response = self.client.delete(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Sweet.objects.filter(id=self.sweet.id).exists()