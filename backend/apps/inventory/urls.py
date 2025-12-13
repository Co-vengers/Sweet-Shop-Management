"""
URL Configuration for Inventory Management
"""

from django.urls import path
from . import views

urlpatterns = [
    path('<int:pk>/purchase/', views.purchase_sweet, name='purchase-sweet'),
    path('<int:pk>/restock/', views.restock_sweet, name='restock-sweet'),
]