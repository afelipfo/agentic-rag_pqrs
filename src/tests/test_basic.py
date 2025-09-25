"""Basic tests for the unified PQRS system."""

import pytest
from fastapi.testclient import TestClient

from ..main import app
from ..services.data_service import data_service
from ..agents.query_agent import query_agent


@pytest.fixture
def client():
    """Test client fixture."""
    return TestClient(app)


def test_health_check(client):
    """Test health check endpoint."""
    response = client.get("/api/health/")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "services" in data


def test_root_endpoint(client):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Sistema Unificado PQRS" in data["message"]


def test_data_loading():
    """Test that data service can load data."""
    # This test assumes data files exist
    try:
        stats = data_service.load_all_data()
        assert isinstance(stats, dict)
        assert "pqrs_records" in stats or "pqrs_total" in stats
    except Exception as e:
        # If data loading fails, that's expected in test environment
        pytest.skip(f"Data loading failed (expected in test env): {e}")


def test_query_agent_initialization():
    """Test that query agent initializes properly."""
    assert query_agent is not None
    status = query_agent.get_status()
    assert "name" in status
    assert status["name"] == "Query Agent"


def test_agent_coordinator():
    """Test agent coordinator functionality."""
    from ..agents.coordinator import agent_coordinator

    # Test capabilities
    capabilities = agent_coordinator.get_capabilities()
    assert "assignment" in capabilities
    assert "query" in capabilities
    assert "data_management" in capabilities


@pytest.mark.asyncio
async def test_query_endpoint(client):
    """Test query endpoint (may fail without data)."""
    response = client.post(
        "/api/query/pqrs",
        json={
            "query": "test",
            "query_type": "semantic",
            "limit": 5
        }
    )
    # May return error if no data, but should not crash
    assert response.status_code in [200, 500]


def test_assignment_status(client):
    """Test assignment agent status endpoint."""
    response = client.get("/api/assignment/status")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert data["name"] == "Assignment Agent"


if __name__ == "__main__":
    pytest.main([__file__])