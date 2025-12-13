# from django.db import models

# class Sweet(models.Model):
#     """
#     Model representing a sweet item in the shop.
#     """
#     CATEGORY_CHOICES = (
#         ('CHOCOLATE', 'Chocolate'),
#         ('GUMMY', 'Gummy'),
#         ('HARD_CANDY', 'Hard Candy'),
#         ('OTHER', 'Other'),
#     )

#     name = models.CharField(max_length=150, unique=True)
#     category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='OTHER')
#     # Use DecimalField for financial data
#     price = models.DecimalField(max_digits=6, decimal_places=2)
#     quantity = models.IntegerField(default=0)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'sweets'
#         ordering = ['name']

#     def __str__(self):
#         return f'{self.name} (Qty: {self.quantity})'

"""
Sweet Model
Represents a sweet/candy item in the shop
"""

from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Sweet(models.Model):
    """
    Sweet Model
    Stores information about sweets available in the shop
    """
    
    # Category choices
    CATEGORY_CHOICES = [
        ('Chocolate', 'Chocolate'),
        ('Gummy', 'Gummy'),
        ('Hard Candy', 'Hard Candy'),
        ('Lollipop', 'Lollipop'),
        ('Sour', 'Sour'),
        ('Other', 'Other'),
    ]
    
    # Basic information
    name = models.CharField(
        max_length=200,
        help_text="Name of the sweet"
    )
    
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='Other',
        help_text="Category of the sweet"
    )
    
    description = models.TextField(
        blank=True,
        help_text="Detailed description of the sweet"
    )
    
    # Pricing and inventory
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Price per unit"
    )
    
    quantity = models.IntegerField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text="Current quantity in stock"
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'sweets'
        ordering = ['name']
        verbose_name = 'Sweet'
        verbose_name_plural = 'Sweets'
    
    def __str__(self):
        """String representation"""
        return self.name
    
    @property
    def is_in_stock(self):
        """Check if sweet is in stock"""
        return self.quantity > 0