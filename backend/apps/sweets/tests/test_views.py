"""
Tests for Sweet API Endpoints
"""

import pytest
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

from apps.sweets.models import Sweet

User = get_user_model()


# =========================
# LIST ENDPOINT
# =========================
@pytest.mark.django_db
class TestSweetListEndpoint:
    """Test GET /api/sweets/"""

    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="testuser@example.com",
            username="testuser",
            password="testpass123"
        )
        self.url = "/api/sweets/"

    def test_list_sweets_authenticated(self):
        Sweet.objects.create(
            name="Sweet 1", category="Chocolate",
            price=Decimal("2.00"), quantity=10
        )
        Sweet.objects.create(
            name="Sweet 2", category="Gummy",
            price=Decimal("1.50"), quantity=5
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_list_sweets_unauthenticated(self):
        response = self.client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# =========================
# CREATE ENDPOINT
# =========================
@pytest.mark.django_db
class TestSweetCreateEndpoint:
    """Test POST /api/sweets/"""

    def setup_method(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email="user@example.com",
            username="user",
            password="pass123"
        )

        self.admin = User.objects.create_user(
            email="admin@example.com",
            username="admin",
            password="admin123",
            is_admin=True
        )

        self.url = "/api/sweets/"

    def test_create_sweet_as_admin(self):
        self.client.force_authenticate(user=self.admin)

        data = {
            "name": "New Chocolate",
            "category": "Chocolate",
            "price": "2.50",
            "quantity": 100,
            "description": "Delicious chocolate",
        }

        response = self.client.post(self.url, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert Sweet.objects.filter(name="New Chocolate").exists()

    def test_create_sweet_as_regular_user_forbidden(self):
        self.client.force_authenticate(user=self.user)

        data = {
            "name": "New Chocolate",
            "category": "Chocolate",
            "price": "2.50",
            "quantity": 100,
        }

        response = self.client.post(self.url, data, format="json")

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_sweet_with_invalid_data(self):
        self.client.force_authenticate(user=self.admin)

        data = {
            "name": "",
            "price": "-2.50",
            "quantity": -10,
        }

        response = self.client.post(self.url, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST


# =========================
# DETAIL ENDPOINT
# =========================
@pytest.mark.django_db
class TestSweetDetailEndpoint:
    """Test GET /api/sweets/:id/"""

    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user",
            password="pass123"
        )

        self.sweet = Sweet.objects.create(
            name="Test Sweet",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=10
        )

    def test_get_sweet_detail_authenticated(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(f"/api/sweets/{self.sweet.id}/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == self.sweet.id

    def test_get_nonexistent_sweet(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/sweets/99999/")

        assert response.status_code == status.HTTP_404_NOT_FOUND


# =========================
# UPDATE ENDPOINT
# =========================
@pytest.mark.django_db
class TestSweetUpdateEndpoint:
    """Test PUT /api/sweets/:id/"""

    def setup_method(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email="user@example.com",
            username="user",
            password="pass123"
        )

        self.admin = User.objects.create_user(
            email="admin@example.com",
            username="admin",
            password="admin123",
            is_admin=True
        )

        self.sweet = Sweet.objects.create(
            name="Old Name",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=10
        )

    def test_update_sweet_as_admin(self):
        self.client.force_authenticate(user=self.admin)

        data = {
            "name": "Updated Name",
            "category": "Gummy",
            "price": "3.00",
            "quantity": 20,
        }

        response = self.client.put(
            f"/api/sweets/{self.sweet.id}/",
            data,
            format="json"
        )

        assert response.status_code == status.HTTP_200_OK

        self.sweet.refresh_from_db()
        assert self.sweet.name == "Updated Name"
        assert self.sweet.price == Decimal("3.00")

    def test_update_sweet_as_regular_user_forbidden(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            f"/api/sweets/{self.sweet.id}/",
            {},
            format="json"
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN


# =========================
# DELETE ENDPOINT
# =========================
@pytest.mark.django_db
class TestSweetDeleteEndpoint:
    """Test DELETE /api/sweets/:id/"""

    def setup_method(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email="user@example.com",
            username="user",
            password="pass123"
        )

        self.admin = User.objects.create_user(
            email="admin@example.com",
            username="admin",
            password="admin123",
            is_admin=True
        )

        self.sweet = Sweet.objects.create(
            name="To Delete",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=10
        )

    def test_delete_sweet_as_admin(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.delete(f"/api/sweets/{self.sweet.id}/")

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Sweet.objects.filter(id=self.sweet.id).exists()

    def test_delete_sweet_as_regular_user_forbidden(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(f"/api/sweets/{self.sweet.id}/")

        assert response.status_code == status.HTTP_403_FORBIDDEN


# =========================
# SEARCH ENDPOINT
# =========================
@pytest.mark.django_db
class TestSweetSearchEndpoint:
    """Test GET /api/sweets/search/"""

    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user",
            password="pass123"
        )

        Sweet.objects.create(
            name="Milk Chocolate Bar",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=10
        )
        Sweet.objects.create(
            name="Dark Chocolate Truffle",
            category="Chocolate",
            price=Decimal("3.50"),
            quantity=5
        )
        Sweet.objects.create(
            name="Gummy Bears",
            category="Gummy",
            price=Decimal("1.50"),
            quantity=20
        )
        Sweet.objects.create(
            name="Sour Worms",
            category="Sour",
            price=Decimal("2.00"),
            quantity=15
        )

        self.url = "/api/sweets/search/"
        self.client.force_authenticate(user=self.user)

    def test_search_by_name(self):
        response = self.client.get(self.url, {"name": "chocolate"})
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_search_by_category(self):
        response = self.client.get(self.url, {"category": "Gummy"})
        assert len(response.data) == 1
        assert response.data[0]["name"] == "Gummy Bears"

    def test_search_by_price_range(self):
        response = self.client.get(
            self.url, {"min_price": "2.00", "max_price": "3.00"}
        )
        assert len(response.data) == 2

    def test_search_with_multiple_filters(self):
        response = self.client.get(
            self.url, {"name": "chocolate", "min_price": "3.00"}
        )
        assert len(response.data) == 1
        assert response.data[0]["name"] == "Dark Chocolate Truffle"

    def test_search_no_results(self):
        response = self.client.get(self.url, {"name": "nonexistent"})
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0
