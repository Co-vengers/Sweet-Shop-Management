from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserSerializer
# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user
    
    POST /api/auth/register/
    Body: {
        "email": "user@example.com",
        "username": "username",
        "password": "securepass123",
        "password2": "securepass123"
    }
    
    Returns: {
        "user": {...},
        "access": "jwt_token",
        "refresh": "jwt_refresh_token"
    }
    """
    serializer = UserRegistrationSerializer(data = request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status = status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])  # Anyone can login
def login(request):
    """
    Login user with email and password
    
    POST /api/auth/login/
    Body: {
        "email": "user@example.com",
        "password": "securepass123"
    }
    
    Returns: {
        "access": "jwt_token",
        "refresh": "jwt_refresh_token",
        "user": {...}
    }
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'detail': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Authenticate using email as username
    user = authenticate(request, username=email, password=password)
    
    if user is not None:
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'detail': 'Invalid email or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get current logged-in user's profile
    
    GET /api/auth/profile/
    Headers: Authorization: Bearer 
    
    Returns: {
        "id": 1,
        "email": "user@example.com",
        "username": "username",
        "is_admin": false
    }
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)