import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from apps.authentication.models import User
from apps.sweets.models import Sweet
from .test_models import UserFactory, SweetFactory # Import factories

# --- Helper Functions ---

def get_auth_client(user, client):
    """Generates a client with JWT authentication."""
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client

# --- View Tests ---

@pytest.mark.django_db
class TestSweetListAndCreate:
    
    def setup_method(self):
        self.list_url = reverse('sweet-list') # /api/sweets/
        self.client = APIClient()
        self.regular_user = UserFactory()
        self.admin_user = UserFactory(is_admin=True, is_staff=True)
        SweetFactory.create_batch(5) # Create 5 sweets for listing
    
    # --- GET /api/sweets/ (List) Tests ---
    
    def test_list_sweets_unauthenticated_denied(self):
        """Unauthenticated users cannot view the list."""
        response = self.client.get(self.list_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_sweets_authenticated_success(self):
        """Authenticated users can view the list."""
        auth_client = get_auth_client(self.regular_user, self.client)
        response = auth_client.get(self.list_url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 5 # Check pagination result count
        assert 'name' in response.data['results'][0] # Check data structure
        
    # --- POST /api/sweets/ (Create) Tests ---

    def test_create_sweet_regular_user_denied(self):
        """Regular users cannot create a new sweet."""
        auth_client = get_auth_client(self.regular_user, self.client)
        data = {
            'name': 'Jelly Beans',
            'category': 'GUMMY',
            'price': 3.99,
            'quantity': 100
        }
        response = auth_client.post(self.list_url, data)
        assert response.status_code == status.HTTP_403_FORBIDDEN # Should fail due to lack of admin permission

    def test_create_sweet_admin_success(self):
        """Admin users can create a new sweet."""
        auth_client = get_auth_client(self.admin_user, self.client)
        data = {
            'name': 'Gourmet Truffles',
            'category': 'CHOCOLATE',
            'price': 8.50,
            'quantity': 25
        }
        response = auth_client.post(self.list_url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Sweet.objects.filter(name='Gourmet Truffles').exists()
        assert response.data['name'] == 'Gourmet Truffles'
        assert float(response.data['price']) == 8.50

    def test_create_sweet_missing_required_fields_fail(self):
        """Test creation fails when missing name/price."""
        auth_client = get_auth_client(self.admin_user, self.client)
        data = {
            'category': 'GUMMY',
            'quantity': 100
            # Missing 'name' and 'price'
        }
        response = auth_client.post(self.list_url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data
        assert 'price' in response.data

@pytest.mark.django_db
class TestSweetRetrieveUpdateDestroy:
    
    def setup_method(self):
        self.client = APIClient()
        self.sweet = SweetFactory(name='Test Chocolate', price=10.00, quantity=5)
        self.detail_url = reverse('sweet-detail', kwargs={'pk': self.sweet.id}) # Requires URL name 'sweet-detail'
        self.regular_user = UserFactory()
        self.admin_user = UserFactory(is_admin=True, is_staff=True)
    
    # --- GET /api/sweets/:id (Retrieve) Tests ---
    
    def test_retrieve_sweet_authenticated_success(self):
        """Authenticated user can retrieve a sweet's details."""
        auth_client = get_auth_client(self.regular_user, self.client)
        response = auth_client.get(self.detail_url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Test Chocolate'

    # --- PUT /api/sweets/:id (Update) Tests ---
    
    def test_update_sweet_regular_user_denied(self):
        """Regular users cannot update a sweet."""
        auth_client = get_auth_client(self.regular_user, self.client)
        update_data = {'name': 'New Name', 'price': 99.99}
        response = auth_client.put(self.detail_url, update_data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        
    def test_update_sweet_admin_success(self):
        """Admin users can update a sweet."""
        auth_client = get_auth_client(self.admin_user, self.client)
        update_data = {
            'name': 'Updated Chocolate', 
            'price': 15.00,
            'quantity': 10
        }
        response = auth_client.put(self.detail_url, update_data, format='json')
        
        self.sweet.refresh_from_db() # Refresh data from database
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Updated Chocolate'
        assert self.sweet.name == 'Updated Chocolate'
        
    # --- DELETE /api/sweets/:id (Delete) Tests ---
    
    def test_delete_sweet_regular_user_denied(self):
        """Regular users cannot delete a sweet."""
        auth_client = get_auth_client(self.regular_user, self.client)
        response = auth_client.delete(self.detail_url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Sweet.objects.filter(id=self.sweet.id).exists() # Still exists
        
    def test_delete_sweet_admin_success(self):
        """Admin users can delete a sweet."""
        auth_client = get_auth_client(self.admin_user, self.client)
        response = auth_client.delete(self.detail_url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Sweet.objects.filter(id=self.sweet.id).exists() # Deleted