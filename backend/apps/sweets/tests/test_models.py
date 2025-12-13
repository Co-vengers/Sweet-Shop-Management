"""
Tests for Sweet Model
"""

import pytest
from decimal import Decimal
from django.core.exceptions import ValidationError
from apps.sweets.models import Sweet


@pytest.mark.django_db
class TestSweetModel:
    """Test cases for Sweet model"""
    
    def test_create_sweet_with_valid_data(self):
        """
        Test creating a sweet with all required fields
        """
        sweet = Sweet.objects.create(
            name="Chocolate Bar",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=100,
            description="Delicious milk chocolate bar"
        )
        
        assert sweet.name == "Chocolate Bar"
        assert sweet.category == "Chocolate"
        assert sweet.price == Decimal("2.50")
        assert sweet.quantity == 100
        assert sweet.description == "Delicious milk chocolate bar"
        assert sweet.id is not None
        assert sweet.created_at is not None
        assert sweet.updated_at is not None
    
    def test_sweet_str_representation(self):
        """
        Test the string representation of a sweet
        """
        sweet = Sweet.objects.create(
            name="Gummy Bears",
            category="Gummy",
            price=Decimal("3.00"),
            quantity=50
        )
        
        assert str(sweet) == "Gummy Bears"
    
    def test_create_sweet_without_name_raises_error(self):
        """
        Test that creating a sweet without a name raises an error
        """
        with pytest.raises(ValidationError):
            sweet = Sweet(
                name="",
                category="Candy",
                price=Decimal("1.50"),
                quantity=10
            )
            sweet.full_clean()  # This triggers validation
    
    def test_create_sweet_with_negative_price_raises_error(self):
        """
        Test that negative price is not allowed
        """
        with pytest.raises(ValidationError):
            sweet = Sweet(
                name="Invalid Sweet",
                category="Candy",
                price=Decimal("-1.50"),
                quantity=10
            )
            sweet.full_clean()
    
    def test_create_sweet_with_negative_quantity_raises_error(self):
        """
        Test that negative quantity is not allowed
        """
        with pytest.raises(ValidationError):
            sweet = Sweet(
                name="Invalid Sweet",
                category="Candy",
                price=Decimal("2.50"),
                quantity=-5
            )
            sweet.full_clean()
    
    def test_sweet_is_in_stock_property(self):
        """
        Test the is_in_stock property
        """
        # Sweet with quantity > 0 should be in stock
        sweet_in_stock = Sweet.objects.create(
            name="In Stock Sweet",
            category="Candy",
            price=Decimal("2.00"),
            quantity=10
        )
        assert sweet_in_stock.is_in_stock is True
        
        # Sweet with quantity = 0 should be out of stock
        sweet_out_of_stock = Sweet.objects.create(
            name="Out of Stock Sweet",
            category="Candy",
            price=Decimal("2.00"),
            quantity=0
        )
        assert sweet_out_of_stock.is_in_stock is False
    
    def test_sweet_category_choices(self):
        """
        Test that only valid categories are accepted
        """
        valid_categories = [
            "Chocolate",
            "Gummy",
            "Hard Candy",
            "Lollipop",
            "Sour",
            "Other"
        ]
        
        # Valid category should work
        for category in valid_categories:
            sweet = Sweet.objects.create(
                name=f"Test {category}",
                category=category,
                price=Decimal("2.00"),
                quantity=10
            )
            assert sweet.category == category
    
    def test_sweet_ordering(self):
        """
        Test that sweets are ordered by name by default
        """
        Sweet.objects.create(name="Zebra Gum", category="Gummy", price=Decimal("1.00"), quantity=10)
        Sweet.objects.create(name="Apple Candy", category="Hard Candy", price=Decimal("1.50"), quantity=5)
        Sweet.objects.create(name="Mint Chocolate", category="Chocolate", price=Decimal("2.00"), quantity=15)
        
        sweets = list(Sweet.objects.all())
        
        # Should be ordered alphabetically by name
        assert sweets[0].name == "Apple Candy"
        assert sweets[1].name == "Mint Chocolate"
        assert sweets[2].name == "Zebra Gum"