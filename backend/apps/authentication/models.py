from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.
class UserManager(BaseUserManager):
    """
    Custom manager for User model
    This handles creating users and superusers
    """
    
    def create_user(self, email, username, password=None, **extra_fields):
        """
        Create and save a regular user
        """
        # Validate email
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')
        
        # Normalize email (lowercase the domain part)
        email = self.normalize_email(email)
        
        # Create user instance
        user = self.model(email=email, username=username, **extra_fields)
        
        # Hash the password (never store plain passwords!)
        user.set_password(password)
        
        # Save to database
        user.save(using=self._db)
        
        return user
    
    def create_superuser(self, email, username, password=None, **extra_fields):
        """
        Create and save a superuser (admin)
        """
        # Set admin permissions
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        # Use create_user to create the superuser
        return self.create_user(email, username, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User Model
    Uses email for authentication instead of username
    """
    # Email field (must be unique)
    email = models.EmailField(
        max_length=255,
        unique=True,
        help_text='User email address'
    )
    
    # Username field
    username = models.CharField(
        max_length=150,
        unique=True,
        help_text='User username'
    )
    
    # Is this user an admin?
    is_admin = models.BooleanField(
        default=False,
        help_text='Is this user an admin who can manage sweets?'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Use our custom manager
    objects = UserManager()
    
    # Use email to log in (instead of username)
    USERNAME_FIELD = 'email'
    
    # Required fields when creating superuser
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        """String representation of user"""
        return self.username
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'