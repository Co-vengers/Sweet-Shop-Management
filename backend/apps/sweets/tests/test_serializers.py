"""
Tests for Sweet Serializers
"""

import pytest
from decimal import Decimal
from apps.sweets.models import Sweet
from apps.sweets.serializers import SweetSerializer


@pytest.mark.django_db
class TestSweetSerializer:
    """Test cases for SweetSerializer"""
    
    def test_serialize_sweet(self):
        """
        Test serializing a sweet object to JSON
        """
        sweet = Sweet.objects.create(
            name="Test Chocolate",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=100,
            description="Test description"
        )
        
        serializer = SweetSerializer(sweet)
        data = serializer.data
        
        assert data['name'] == "Test Chocolate"
        assert data['category'] == "Chocolate"
        assert data['price'] == "2.50"
        assert data['quantity'] == 100
        assert data['description'] == "Test description"
        assert 'id' in data
        assert 'is_in_stock' in data
        assert data['is_in_stock'] is True
    
    def test_deserialize_valid_data(self):
        """
        Test creating a sweet from valid JSON data
        """
        data = {
            'name': 'New Sweet',
            'category': 'Gummy',
            'price': '3.00',
            'quantity': 50,
            'description': 'A new sweet'
        }
        
        serializer = SweetSerializer(data=data)
        assert serializer.is_valid()
        
        sweet = serializer.save()
        assert sweet.name == 'New Sweet'
        assert sweet.category == 'Gummy'
        assert sweet.price == Decimal('3.00')
        assert sweet.quantity == 50
    
    def test_deserialize_without_required_fields(self):
        """
        Test that missing required fields cause validation errors
        """
        data = {
            'category': 'Chocolate',
            'price': '2.50'
        }
        
        serializer = SweetSerializer(data=data)
        assert not serializer.is_valid()
        assert 'name' in serializer.errors
        assert 'quantity' in serializer.errors
    
    def test_deserialize_with_negative_price(self):
        """
        Test that negative price is rejected
        """
        data = {
            'name': 'Invalid Sweet',
            'category': 'Candy',
            'price': '-1.50',
            'quantity': 10
        }
        
        serializer = SweetSerializer(data=data)
        assert not serializer.is_valid()
        assert 'price' in serializer.errors
    
    def test_deserialize_with_negative_quantity(self):
        """
        Test that negative quantity is rejected
        """
        data = {
            'name': 'Invalid Sweet',
            'category': 'Candy',
            'price': '2.50',
            'quantity': -10
        }
        
        serializer = SweetSerializer(data=data)
        assert not serializer.is_valid()
        assert 'quantity' in serializer.errors