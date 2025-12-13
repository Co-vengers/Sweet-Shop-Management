"""
Serializers for Authentication
Serializers convert Python objects to JSON and validate input data
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    Validates user input and creates new users
    """
    # password2 is for password confirmation (not stored in database)
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],  # Validate password strength
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']
    
    def validate(self, attrs):
        """
        Check that the two password fields match
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
    
    def create(self, validated_data):
        """
        Create and return a new user
        """
        # Remove password2 from data (we don't need it)
        validated_data.pop('password2')
        
        # Create user with hashed password
        user = User.objects.create_user(**validated_data)
        
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User object
    Used to return user data in responses
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_admin', 'created_at']
        read_only_fields = ['id', 'created_at']