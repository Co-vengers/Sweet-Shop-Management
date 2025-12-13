"""
Django Admin Configuration for Sweets
"""

from django.contrib import admin
from .models import Sweet


@admin.register(Sweet)
class SweetAdmin(admin.ModelAdmin):
    """Admin interface for Sweet model"""

    list_display = (
        'name',
        'category',
        'price',
        'quantity',
        'created_at',
    )

    list_filter = (
        'category',
        'created_at',
    )

    search_fields = (
        'name',
    )

    ordering = (
        'name',
    )

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category'),
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'quantity'),
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    readonly_fields = (
        'created_at',
        'updated_at',
    )
