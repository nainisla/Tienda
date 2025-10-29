from flask import jsonify, request
from extensions import db # Usamos la instancia db
from models import Producto 

# 🚨 NUEVA FUNCIÓN: Envuelve todas las rutas 🚨
def register_routes(app):
    """Registra todos los endpoints de la API en la instancia Flask."""

    # --- Listar todos los productos (GET) ---
    @app.route("/productos", methods=["GET"])
    def listar_productos():
        productos = Producto.query.all()
        return jsonify([{
            "id": p.id,
            "nombre": p.nombre,
            "precio": p.precio,
            "imagen": p.imagen,
            "descripcion": p.descripcion
        } for p in productos])

    # --- Obtener un producto por ID (GET) ---
    @app.route("/productos/<int:id>", methods=["GET"])
    def obtener_producto(id):
        producto = Producto.query.get_or_404(id)
        # ... (cuerpo igual)
        return jsonify({
            "id": producto.id,
            "nombre": producto.nombre,
            "precio": producto.precio,
            "imagen": producto.imagen,
            "descripcion": producto.descripcion
        })

    # --- Actualizar un producto existente (PUT) ---
    @app.route("/productos/<int:id>", methods=["PUT"])
    def actualizar_producto(id):
        producto = Producto.query.get_or_404(id)
        data = request.json
        
        producto.nombre = data.get("nombre", producto.nombre)
        producto.precio = data.get("precio", producto.precio)
        producto.imagen = data.get("imagen", producto.imagen)
        producto.descripcion = data.get("descripcion", producto.descripcion)
        
        db.session.commit()
        return jsonify({"mensaje": "Producto actualizado"})

    # --- Eliminar un producto (DELETE) ---
    @app.route("/productos/<int:id>", methods=["DELETE"])
    def eliminar_producto(id):
        producto = Producto.query.get_or_404(id)
        db.session.delete(producto)
        db.session.commit()
        return jsonify({"mensaje": "Producto eliminado"})

    # --- Agregar un nuevo producto (POST) ---
    @app.route("/productos", methods=["POST"])
    def agregar_producto():
        data = request.json
        try:
            nuevo = Producto(
                nombre=data["nombre"],
                precio=data["precio"],
                imagen=data.get("imagen", None),
                descripcion=data.get("descripcion", None)
            )
            db.session.add(nuevo)
            db.session.commit()
            return jsonify({"mensaje": "Producto agregado con éxito", "id": nuevo.id}), 201
        except KeyError as e:
            return jsonify({"error": f"Falta el campo requerido: {e}"}), 400
        except Exception:
            db.session.rollback()
            return jsonify({"error": "Error interno al agregar producto"}), 500