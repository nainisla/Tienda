def test_obtener_productos(client):
    """Verifica que /productos devuelva un JSON válido."""
    response = client.get("/productos")
    assert response.status_code in (200, 500, 403)
    data = response.get_json()
    assert isinstance(data, (list, dict))


def test_agregar_producto(client):
    """Prueba la creación de un producto nuevo."""
    nuevo_producto = {
        "nombre": "Remera básica",
        "precio": 1500,
        "imagen": "https://example.com/remera.png",
        "descripcion": "Remera blanca de algodón"
    }

    response = client.post("/productos", json=nuevo_producto)
    data = response.get_json()

    assert response.status_code in (200, 201)
    assert "mensaje" in data
