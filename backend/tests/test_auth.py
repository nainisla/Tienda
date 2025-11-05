from unittest.mock import patch

def test_login_tradicional_exitoso(client):
    """Debe loguear correctamente a un usuario registrado."""
    payload = {"email": "admin@lumine.com", "password": "password123"}
    response = client.post("/auth/login", json=payload)

    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert data["mensaje"] == "Login tradicional exitoso"


def test_login_tradicional_invalido(client):
    """Debe devolver error con credenciales incorrectas."""
    payload = {"email": "user@lumine.com", "password": "mala"}
    response = client.post("/auth/login", json=payload)

    assert response.status_code == 401
    data = response.get_json()
    assert "error" in data





@patch("routes.id_token.verify_oauth2_token")
def test_login_google_exitoso(mock_verify, client):
    """Simula un login correcto con Google."""
    mock_verify.return_value = {
        "sub": "123456",
        "email": "test@google.com",
        "name": "Test User"
    }

    response = client.post("/auth/google", json={"token": "fake_token"})
    data = response.get_json()

    assert response.status_code == 200
    assert "access_token" in data
    assert "mensaje" in data


def test_login_google_sin_token(client):
    """Debe fallar si no se envía el token."""
    response = client.post("/auth/google", json={})
    assert response.status_code == 400
    assert "error" in response.get_json()





@patch("routes.requests.get")
def test_login_facebook_exitoso(mock_get, client):
    """Simula un login exitoso con Facebook."""
    class MockResponse:
        def __init__(self, json_data):
            self._json_data = json_data
        def json(self):
            return self._json_data

    mock_get.side_effect = [
        MockResponse({
            "data": {"is_valid": True, "app_id": "2407087869688104", "user_id": "999"}
        }),
        MockResponse({
            "email": "fb@test.com", "name": "FB User"
        })
    ]

    response = client.post("/auth/facebook", json={"accessToken": "fake_token"})
    data = response.get_json()

    assert response.status_code == 200
    assert "Inicio de sesión" in data["mensaje"]
    assert "access_token" in data


def test_login_facebook_sin_token(client):
    """Debe fallar si no se envía token de Facebook."""
    response = client.post("/auth/facebook", json={})
    assert response.status_code == 400
    assert "mensaje" in response.get_json()
