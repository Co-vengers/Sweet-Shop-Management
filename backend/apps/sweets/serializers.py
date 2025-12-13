from decimal import Decimal
from rest_framework import serializers
from .models import Sweet


class SweetSerializer(serializers.ModelSerializer):
    """
    Serializer for Sweet model
    """

    price = serializers.DecimalField(
        max_digits=6,
        decimal_places=2,
        min_value=Decimal("0.01")
    )

    quantity = serializers.IntegerField(
        min_value=0,
        required=True
    )

    is_in_stock = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Sweet
        fields = (
            'id',
            'name',
            'category',
            'description',
            'price',
            'quantity',
            'is_in_stock',
            'created_at',
            'updated_at',
        )

    def get_is_in_stock(self, obj):
        return obj.quantity > 0
