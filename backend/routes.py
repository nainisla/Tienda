from flask import jsonify, request
from extensions import db # Usamos la instancia db
from models import Producto 
# 🚨 IMPORTACIONES ADICIONALES NECESARIAS PARA LA AUTENTICACIÓN
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from datetime import timedelta

# 🚨 NUEVA FUNCIÓN: Envuelve todas las rutas 🚨
def register_routes(app):
    """Registra todos los endpoints de la API en la instancia Flask."""

    # --- MODELO DE USUARIO SIMPLE (Solo para demostración de Auth) ---
    # En una aplicación real, usarías un modelo de base de datos para usuarios
    USERS = {
        "admin@lumine.com": {"password": "password123", "role": "admin"},
        "user@lumine.com": {"password": "password123", "role": "user"},
    }
    
    # ----------------------------------------------------
    # RUTAS DE AUTENTICACIÓN (INCLUIDAS PARA SOLUCIONAR EL ERROR 400)
    # ----------------------------------------------------

    # --- Login Tradicional (POST /auth/login) ---
    @app.route("/auth/login", methods=["POST"])
    def login_tradicional():
        data = request.json
        email = data.get('email')
        password = data.get('password')

        user_info = USERS.get(email)
        
        if user_info and user_info["password"] == password:
            # Crear un token de acceso JWT. Usamos el email como identidad.
            access_token = create_access_token(identity=email, expires_delta=timedelta(days=7))
            return jsonify({
                "mensaje": "Login tradicional exitoso", 
                "access_token": access_token, 
                "user_id": email,
                "role": user_info["role"]
            }), 200
        
        return jsonify({"error": "Credenciales inválidas"}), 401

    # --- Login con Google (POST /auth/google) ---
    @app.route("/auth/google", methods=["POST"])
    def login_google():
        data = request.json
        token = data.get('token')
        
        # 🟢 CORRECCIÓN: Usar el ID de Cliente real del frontend (main.jsx)
        GOOGLE_CLIENT_ID = "194126254993-92flod7jf0859g80vactvoao3s5e4u09.apps.googleusercontent.com" 

        if not token:
            return jsonify({"error": "Token de Google no proporcionado"}), 400

        try:
            # 1. Verificar el token de ID de Google
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                GOOGLE_CLIENT_ID # <--- Ahora usa el ID correcto
            )
            
            user_email = idinfo['email']
            user_name = idinfo.get('name', 'Usuario Google')
            role = USERS.get(user_email, {}).get("role", "user") # Ejemplo de rol

            # 4. Crear el token de acceso JWT de tu aplicación
            access_token = create_access_token(identity=user_email, expires_delta=timedelta(days=7))

            return jsonify({
                "mensaje": f"Bienvenido, {user_name}", 
                "access_token": access_token, 
                "user_id": user_email,
                "role": role
            }), 200

        except ValueError as e:
            # Esta excepción ahora capturará el error si el token está expirado, es inválido o el CLIENT_ID es incorrecto.
            print(f"Error de validación de Google Token: {e}")
            return jsonify({"error": "Token de Google inválido o expirado"}), 401
        except Exception as e:
            # Token inválido (posiblemente por CLIENT_ID incorrecto o token expirado)
            print(f"Error de validación de Google Token: {e}")
            return jsonify({"error": "Token de Google inválido o expirado"}), 401
        except Exception as e:
            print(f"Error inesperado durante el login de Google: {e}")
            return jsonify({"error": "Error interno del servidor"}), 500

    # ----------------------------------------------------
    # RUTAS EXISTENTES DE PRODUCTOS (Se mantienen intactas)
    # ----------------------------------------------------

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