"""
Serializers for Inventory Management
"""

from rest_framework import serializers


class PurchaseSerializer(serializers.Serializer):
    """
    Serializer for purchase requests
    """
    quantity = serializers.IntegerField(
        default=1,
        min_value=1,
        help_text="Quantity to purchase (default: 1)"
    )
    
    def validate_quantity(self, value):
        """Ensure quantity is positive"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value


class RestockSerializer(serializers.Serializer):
    """
    Serializer for restock requests
    """
    quantity = serializers.IntegerField(
        default=10,
        min_value=1,
        help_text="Quantity to add to stock (default: 10)"
    )
    
    def validate_quantity(self, value):
        """Ensure quantity is positive"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value