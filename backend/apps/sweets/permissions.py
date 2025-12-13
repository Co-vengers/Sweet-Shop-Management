"""
Custom Permissions for Sweets API
"""

from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission:
    - Admin users can do anything (POST, PUT, DELETE)
    - Regular authenticated users can only read (GET)
    """
    
    def has_permission(self, request, view):
        # Read permissions for authenticated users
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Write permissions only for admins
        return request.user and request.user.is_authenticated and request.user.is_admin