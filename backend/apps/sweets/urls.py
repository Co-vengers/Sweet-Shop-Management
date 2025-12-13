"""
URL Configuration for Sweets API
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router and register viewset
router = DefaultRouter()
router.register(r'', views.SweetViewSet, basename='sweet')

urlpatterns = [
    path('', include(router.urls)),
]