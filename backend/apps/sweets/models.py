from django.db import models

class Sweet(models.Model):
    """
    Model representing a sweet item in the shop.
    """
    CATEGORY_CHOICES = (
        ('CHOCOLATE', 'Chocolate'),
        ('GUMMY', 'Gummy'),
        ('HARD_CANDY', 'Hard Candy'),
        ('OTHER', 'Other'),
    )

    name = models.CharField(max_length=150, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='OTHER')
    # Use DecimalField for financial data
    price = models.DecimalField(max_digits=6, decimal_places=2)
    quantity = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sweets'
        ordering = ['name']

    def __str__(self):
        return f'{self.name} (Qty: {self.quantity})'