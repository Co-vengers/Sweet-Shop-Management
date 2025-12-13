"""
API Views for Inventory Management
Handles purchase and restock operations
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.sweets.models import Sweet
from apps.sweets.serializers import SweetSerializer
from .serializers import PurchaseSerializer, RestockSerializer
from .permissions import IsAdminUser


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_sweet(request, pk):
    """
    Purchase a sweet (decrease quantity)
    
    POST /api/sweets/:id/purchase/
    Body: {
        "quantity": 1  // Optional, defaults to 1
    }
    
    Returns:
    - 200: Purchase successful
    - 400: Invalid quantity or insufficient stock
    - 404: Sweet not found
    """
    try:
        sweet = Sweet.objects.get(pk=pk)
    except Sweet.DoesNotExist:
        return Response(
            {'error': 'Sweet not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Validate request data
    serializer = PurchaseSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    quantity_to_purchase = serializer.validated_data['quantity']
    
    # Check if sweet is in stock
    if sweet.quantity == 0:
        return Response(
            {'error': f'{sweet.name} is currently out of stock'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if enough quantity available
    if quantity_to_purchase > sweet.quantity:
        return Response(
            {
                'error': f'Insufficient stock. Only {sweet.quantity} units available',
                'available_quantity': sweet.quantity
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Update quantity
    sweet.quantity -= quantity_to_purchase
    sweet.save()
    
    return Response({
        'message': f'Successfully purchased {quantity_to_purchase} unit(s) of {sweet.name}',
        'sweet': SweetSerializer(sweet).data,
        'purchased_quantity': quantity_to_purchase,
        'remaining_quantity': sweet.quantity,
        'total_cost': float(sweet.price) * quantity_to_purchase
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def restock_sweet(request, pk):
    """
    Restock a sweet (increase quantity) - Admin only
    
    POST /api/sweets/:id/restock/
    Body: {
        "quantity": 10  // Optional, defaults to 10
    }
    
    Returns:
    - 200: Restock successful
    - 400: Invalid quantity
    - 403: User is not admin
    - 404: Sweet not found
    """
    try:
        sweet = Sweet.objects.get(pk=pk)
    except Sweet.DoesNotExist:
        return Response(
            {'error': 'Sweet not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Validate request data
    serializer = RestockSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    quantity_to_add = serializer.validated_data['quantity']
    
    # Update quantity
    old_quantity = sweet.quantity
    sweet.quantity += quantity_to_add
    sweet.save()
    
    return Response({
        'message': f'Successfully restocked {sweet.name}',
        'sweet': SweetSerializer(sweet).data,
        'added_quantity': quantity_to_add,
        'previous_quantity': old_quantity,
        'new_quantity': sweet.quantity
    }, status=status.HTTP_200_OK)