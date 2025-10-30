from flask import jsonify, request
from extensions import db
from models import Producto, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from datetime import timedelta
from functools import wraps

def admin_required():
    """Decorador para asegurar que solo los usuarios con rol 'admin' puedan acceder."""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
                claims = get_jwt_identity()
                user_email = claims
                
                user_role = 'admin' if user_email == 'admin@lumine.com' else 'user'
                
                if user_role != 'admin':
                    return jsonify({"mensaje": "Acceso denegado: Se requiere rol de administrador"}), 403
                
                return fn(*args, **kwargs)
            except Exception as e:
                return jsonify({"mensaje": f"Token requerido o inválido: {e}"}), 401
        return decorator
    return wrapper

def register_routes(app):
    """Registra todos los endpoints de la API en la instancia Flask."""

    # --- DATOS DUMMY PARA AUTENTICACIÓN TRADICIONAL ---
    USERS = {
        "admin@lumine.com": {"password": "password123", "role": "admin"},
        "user@lumine.com": {"password": "password123", "role": "user"},
    }
    
    # ----------------------------------------------------
    # RUTAS DE AUTENTICACIÓN
    # ----------------------------------------------------

    # --- Login Tradicional (POST /auth/login) ---
    @app.route("/auth/login", methods=["POST"])
    def login_tradicional():
        data = request.json
        email = data.get('email')
        password = data.get('password')

        user_info = USERS.get(email)
        
        if user_info and user_info["password"] == password:
            
            user = User.query.filter_by(email=email).first()
            
            if not user:
                user = User(
                    email=email,
                    name=email.split('@')[0],
                )
                db.session.add(user)
            db.session.commit()
                
            user_role = user_info["role"]
            
            access_token = create_access_token(
                identity=email, 
                expires_delta=timedelta(days=7),
                additional_claims={"role": user_role}
            )
            
            return jsonify({
                "mensaje": "Login tradicional exitoso", 
                "access_token": access_token, 
                "user_id": email,
                "role": user_role
            }), 200
        
        return jsonify({"error": "Credenciales inválidas"}), 401

    # --- Login con Google (POST /auth/google) ---
    @app.route("/auth/google", methods=["POST"])
    def login_google():
        data = request.json
        token = data.get('token')
        
        GOOGLE_CLIENT_ID = "194126254993-92flod7jf0859g80vactvoao3s5e4u09.apps.googleusercontent.com" 

        if not token:
            return jsonify({"error": "Token de Google no proporcionado"}), 400

        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                GOOGLE_CLIENT_ID
            )
            
            google_id = idinfo['sub']
            user_email = idinfo['email']
            user_name = idinfo.get('name', 'Usuario Google')
            
            user = User.query.filter_by(google_id=google_id).first()
            
            if not user:
                user = User.query.filter_by(email=user_email).first()
                
                if user:
                    user.google_id = google_id
                    if not user.name:
                        user.name = user_name
                else:
                    user = User(
                        email=user_email,
                        name=user_name,
                        google_id=google_id,
                    )
                    db.session.add(user)
            
            db.session.commit()
            
            user_role = 'admin' if user.email == 'admin@lumine.com' else 'user'

            access_token = create_access_token(
                identity=user.email,
                expires_delta=timedelta(days=7),
                additional_claims={"role": user_role}
            )

            return jsonify({
                "mensaje": f"Bienvenido, {user_name}", 
                "access_token": access_token, 
                "user_id": user.email,
                "role": user_role
            }), 200

        except ValueError as e:
            return jsonify({"error": "Token de Google inválido o expirado"}), 401
        except Exception:
            db.session.rollback()
            return jsonify({"error": "Error interno del servidor"}), 500
            
    # ----------------------------------------------------
    # RUTAS DE GESTIÓN (ADMIN)
    # ----------------------------------------------------
    
    # --- Obtener todos los usuarios (GET /users) ---
    @app.route("/users", methods=["GET"])
    @admin_required()
    def obtener_usuarios():
        users = User.query.all()
        
        users_lista = [
            {
                "id": u.id,
                "email": u.email,
                "name": u.name,
                "role": 'admin' if u.email == 'admin@lumine.com' else 'user',
                "is_google_user": u.google_id is not None,
                "created_at": u.created_at.strftime('%Y-%m-%d %H:%M:%S')
            }
            for u in users
        ]
        
        return jsonify(users_lista)

    # ----------------------------------------------------
    # RUTAS DE PRODUCTOS
    # ----------------------------------------------------

    # --- Listar todos los productos (GET /productos) ---
    @app.route("/productos", methods=["GET"])
    def obtener_productos():
        productos = Producto.query.all()
        productos_lista = [
            {
                "id": p.id,
                "nombre": p.nombre,
                "precio": p.precio,
                "imagen": p.imagen,
                "descripcion": p.descripcion,
            }
            for p in productos
        ]
        return jsonify(productos_lista)

    # --- Obtener un producto por ID (GET /productos/<id>) ---
    @app.route("/productos/<int:id>", methods=["GET"])
    def obtener_producto(id):
        producto = Producto.query.get_or_404(id)
        return jsonify(
            {
                "id": producto.id,
                "nombre": producto.nombre,
                "precio": producto.precio,
                "imagen": producto.imagen,
                "descripcion": producto.descripcion,
            }
        )

    # --- Actualizar un producto existente (PUT /productos/<id>) ---
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

    # --- Eliminar un producto (DELETE /productos/<id>) ---
    @app.route("/productos/<int:id>", methods=["DELETE"])
    def eliminar_producto(id):
        producto = Producto.query.get_or_404(id)
        db.session.delete(producto)
        db.session.commit()
        return jsonify({"mensaje": "Producto eliminado"})

    # --- Agregar un nuevo producto (POST /productos) ---
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
