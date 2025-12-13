"""
Tests for Inventory Management Endpoints
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
class TestPurchaseEndpoint:
    """Test POST /api/sweets/:id/purchase/ - Purchase a sweet"""
    
    def setup_method(self):
        """Setup test data"""
        self.client = APIClient()
        
        # Create users
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user',
            password='pass123'
        )
        
        # Create sweet with stock
        self.sweet = Sweet.objects.create(
            name="Test Chocolate",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=10
        )
        
        # Create sweet with no stock
        self.out_of_stock_sweet = Sweet.objects.create(
            name="Out of Stock",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=0
        )
    
    def test_purchase_sweet_success(self):
        """
        Test successful purchase of a sweet
        Should decrease quantity by specified amount
        """
        self.client.force_authenticate(user=self.user)
        
        url = f'/api/sweets/{self.sweet.id}/purchase/'
        data = {'quantity': 3}
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'message' in response.data
        assert response.data['remaining_quantity'] == 7
        
        # Verify database was updated
        self.sweet.refresh_from_db()
        assert self.sweet.quantity == 7
    
    def test_purchase_sweet_default_quantity_one(self):
        """
        Test purchase without specifying quantity (default = 1)
        """
        self.client.force_authenticate(user=self.user)
        
        url = f'/api/sweets/{self.sweet.id}/purchase/'
        
        response = self.client.post(url, {}, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        
        self.sweet.refresh_from_db()
        assert self.sweet.quantity == 9
    
    def test_purchase_sweet_out_of_stock(self):
        """
        Test purchasing sweet with 0 stock
        Should return 400 error
        """
        self.client.force_authenticate(user=self.user)
        
        url = f'/api/sweets/{self.out_of_stock_sweet.id}/purchase/'
        data = {'quantity': 1}
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data
    
    def test_purchase_more_than_available(self):
        """
        Test purchasing more than available quantity
        Should return 400 error
        """
        self.client.force_authenticate(user=self.user)
        
        url = f'/api/sweets/{self.sweet.id}/purchase/'
        data = {'quantity': 15}  # Only 10 available
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data
        
        # Verify quantity wasn't changed
        self.sweet.refresh_from_db()
        assert self.sweet.quantity == 10
    
    def test_purchase_with_invalid_quantity(self):
        """
        Test purchasing with invalid quantity (negative or zero)
        """
        self.client.force_authenticate(user=self.user)
        
        url = f'/api/sweets/{self.sweet.id}/purchase/'
        
        # Test negative quantity
        response = self.client.post(url, {'quantity': -5}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
        # Test zero quantity
        response = self.client.post(url, {'quantity': 0}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_purchase_requires_authentication(self):
        """
        Test that purchase requires authentication
        """
        url = f'/api/sweets/{self.sweet.id}/purchase/'
        data = {'quantity': 1}
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_purchase_nonexistent_sweet(self):
        """
        Test purchasing a sweet that doesn't exist
        """
        self.client.force_authenticate(user=self.user)
        
        url = '/api/sweets/99999/purchase/'
        data = {'quantity': 1}
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestRestockEndpoint:
    """Test POST /api/sweets/:id/restock/ - Restock a sweet (Admin only)"""
    
    def setup_method(self):
        """Setup test data"""
        self.client = APIClient()
        
        # Create regular user
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user',
            password='pass123'
        )
        
        # Create admin user
        self.admin = User.objects.create_user(
            email='admin@example.com',
            username='admin',
            password='admin123',
            is_admin=True
        )
        
        # Create sweet
        self.sweet = Sweet.objects.create(
            name="Test Chocolate",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=5
        )
    
    def test_restock_sweet_as_admin(self):
        """
        Test successful restock by admin
        Should increase quantity by specified amount
        """
        self.client.force_authenticate(user=self.admin)
        
        url = f'/api/sweets/{self.sweet.id}/restock/'
        data = {'quantity': 20}
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'message' in response.data
        assert response.data['new_quantity'] == 25
        
        # Verify database was updated
        self.sweet.refresh_from_db()
        assert self.sweet.quantity == 25
    
    def test_restock_with_default_quantity(self):
        """
        Test restock without specifying quantity (default = 10)
        """
        self.client.force_authenticate(user=self.admin)
        
        url = f'/api/sweets/{self.sweet.id}/restock/'
        
        response = self.client.post(url, {}, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        
        self.sweet.refresh_from_db()
        assert self.sweet.quantity == 15  # 5 + 10
    
    def test_restock_as_regular_user_forbidden(self):
        """
        Test that regular users cannot restock
        Should return 403 Forbidden
        """
        self.client.force_authenticate(user=self.user)
        
        url = f'/api/sweets/{self.sweet.id}/restock/'
        data = {'quantity': 20}
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        
        # Verify quantity wasn't changed
        self.sweet.refresh_from_db()
        assert self.sweet.quantity == 5
    
    def test_restock_with_invalid_quantity(self):
        """
        Test restocking with invalid quantity (negative or zero)
        """
        self.client.force_authenticate(user=self.admin)
        
        url = f'/api/sweets/{self.sweet.id}/restock/'
        
        # Test negative quantity
        response = self.client.post(url, {'quantity': -10}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
        # Test zero quantity
        response = self.client.post(url, {'quantity': 0}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_restock_requires_authentication(self):
        """
        Test that restock requires authentication
        """
        url = f'/api/sweets/{self.sweet.id}/restock/'
        data = {'quantity': 20}
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_restock_nonexistent_sweet(self):
        """
        Test restocking a sweet that doesn't exist
        """
        self.client.force_authenticate(user=self.admin)
        
        url = '/api/sweets/99999/restock/'
        data = {'quantity': 20}
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND