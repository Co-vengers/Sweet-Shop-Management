from rest_framework import serializers
from apps.sweets.models import Sweet

class SweetSerializer(serializers.ModelSerializer):
    """Serializer for the Sweet model."""
    class Meta:
        model = Sweet
        fields = ['id', 'name', 'category', 'price', 'quantity', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']