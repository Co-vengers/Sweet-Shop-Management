"""
API Views for Sweet Management
Handles CRUD operations for sweets
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Sweet
from .serializers import SweetSerializer
from .permissions import IsAdminOrReadOnly



class SweetViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Sweet CRUD operations
    
    Endpoints:
    - GET /api/sweets/ - List all sweets
    - POST /api/sweets/ - Create new sweet (Admin only)
    - GET /api/sweets/:id/ - Get sweet details
    - PUT /api/sweets/:id/ - Update sweet (Admin only)
    - DELETE /api/sweets/:id/ - Delete sweet (Admin only)
    """
    
    queryset = Sweet.objects.all()
    serializer_class = SweetSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    def list(self, request):
        """
        List all sweets
        GET /api/sweets/
        """
        sweets = self.get_queryset()
        serializer = self.get_serializer(sweets, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """
        Create a new sweet (Admin only)
        POST /api/sweets/
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        """
        Get a single sweet's details
        GET /api/sweets/:id/
        """
        try:
            sweet = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(sweet)
            return Response(serializer.data)
        except Sweet.DoesNotExist:
            return Response(
                {'detail': 'Sweet not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def update(self, request, pk=None):
        """
        Update a sweet (Admin only)
        PUT /api/sweets/:id/
        """
        try:
            sweet = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(sweet, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Sweet.DoesNotExist:
            return Response(
                {'detail': 'Sweet not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def destroy(self, request, pk=None):
        """
        Delete a sweet (Admin only)
        DELETE /api/sweets/:id/
        """
        try:
            sweet = self.get_queryset().get(pk=pk)
            sweet.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Sweet.DoesNotExist:
            return Response(
                {'detail': 'Sweet not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search sweets by name, category, or price range
        GET /api/sweets/search/?name=chocolate&category=Chocolate&min_price=2.00&max_price=5.00
        
        Query Parameters:
        - name: Search in sweet name (case-insensitive, partial match)
        - category: Filter by exact category
        - min_price: Minimum price filter
        - max_price: Maximum price filter
        """
        queryset = self.get_queryset()
        
        # Get query parameters
        name = request.query_params.get('name', None)
        category = request.query_params.get('category', None)
        min_price = request.query_params.get('min_price', None)
        max_price = request.query_params.get('max_price', None)
        
        # Apply filters
        if name:
            queryset = queryset.filter(name__icontains=name)
        
        if category:
            queryset = queryset.filter(category=category)
        
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                return Response(
                    {'error': 'Invalid min_price value'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                return Response(
                    {'error': 'Invalid max_price value'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)