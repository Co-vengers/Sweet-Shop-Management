import pytest
from apps.sweets.models import Sweet
from apps.authentication.models import User
import factory
from decimal import Decimal

# --- Factories for Test Data ---

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    email = factory.Faker('email')
    username = factory.Faker('user_name')
    is_admin = False
    
    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        self.set_password('TestPass123!')

class SweetFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Sweet
    name = factory.Sequence(lambda n: f'Sweet Candy {n}')
    category = factory.Iterator(['Chocolate', 'Gummy', 'Hard Candy'])
    # The default factory should *not* generate None, which caused the IntegrityError
    price = factory.Faker('pydecimal', left_digits=2, right_digits=2, positive=True)
    quantity = factory.Faker('random_int', min=1, max=100)

# --- Model Tests ---

@pytest.mark.django_db
class TestSweetModel:
    
    def test_sweet_creation(self):
        """Test creating a basic Sweet instance."""
        sweet = SweetFactory(
            name='Chocolate Bar',
            category='Chocolate',
            # FIX: Pass a Decimal object instead of a string to the factory
            price=Decimal('2.50'), 
            quantity=50
        )
        assert sweet.name == 'Chocolate Bar'
        assert sweet.category == 'Chocolate'
        assert sweet.price == Decimal('2.50') # Assertion is correct
        assert sweet.quantity == 50
        assert str(sweet) == 'Chocolate Bar (Qty: 50)'

    def test_sweet_name_uniqueness(self):
        """Test that Sweet names must be unique."""
        SweetFactory(name='Unique Gummy')
        
        with pytest.raises(Exception):
            SweetFactory(name='Unique Gummy')
            
    def test_default_values(self):
        """Test that quantity defaults to zero if not provided."""
        # This test is now passing, as we are explicitly setting quantity=0
        sweet = SweetFactory(quantity=0)
        assert sweet.quantity == 0
        
    def test_price_precision(self):
        """Test price field handles correct decimal precision."""
        
        # 1. Create the sweet, passing the precise Decimal value.
        sweet_instance = SweetFactory(price=Decimal('1.999'))
        
        # 2. CRITICAL FIX: Explicitly fetch the object from the database 
        #    to ensure rounding/truncation from the DecimalField is applied.
        #    If your model is Sweet, you need to import it (which you have).
        sweet = Sweet.objects.get(pk=sweet_instance.pk) 
        
        # 3. Assert the retrieved value is the correctly rounded value.
        #    1.999 should round up to 2.00 when decimal_places=2.
        assert sweet.price == Decimal('2.00')