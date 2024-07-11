import pytest

import vtesrulings.api


@pytest.fixture(scope="session")
def client():
    app = vtesrulings.api.app
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client
