import pytest
from apps.sweets.models import Sweet
from apps.authentication.models import User
import factory

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
            price='2.50',
            quantity=50
        )
        assert sweet.name == 'Chocolate Bar'
        assert sweet.category == 'Chocolate'
        assert sweet.price == 2.50
        assert sweet.quantity == 50
        assert str(sweet) == 'Chocolate Bar (Qty: 50)'

    def test_sweet_name_uniqueness(self):
        """Test that Sweet names must be unique."""
        SweetFactory(name='Unique Gummy')
        
        with pytest.raises(Exception):
            SweetFactory(name='Unique Gummy')
            
    def test_default_values(self):
        """Test that quantity defaults to zero if not provided."""
        sweet = SweetFactory(quantity=None)
        assert sweet.quantity == 0
        
    def test_price_precision(self):
        """Test price field handles correct decimal precision."""
        sweet = SweetFactory(price=1.999)
        # Django's DecimalField should round/truncate based on max_digits/decimal_places
        # Assuming we use DecimalField(max_digits=5, decimal_places=2)
        assert sweet.price == 2.00 or sweet.price == 1.99 # Depending on backend DB and config