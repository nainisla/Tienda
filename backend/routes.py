from flask import jsonify, request
from extensions import db
from models import Producto, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from datetime import timedelta
from functools import wraps
import requests

FACEBOOK_APP_ID = "2407087869688104"
FACEBOOK_APP_SECRET = "03880b423a19709e27d2048e86b2d3d4"

# El token de aplicación se forma combinando el ID y el Secreto
FACEBOOK_APP_TOKEN = f"{FACEBOOK_APP_ID}|{FACEBOOK_APP_SECRET}"

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
    
    @app.route("/auth/facebook", methods=["POST"])
    def facebook_auth():
     data = request.json
     access_token = data.get("accessToken")

     if not access_token:
        return jsonify({"mensaje": "No se proporcionó token de acceso de Facebook"}), 400

     try:
        # 1. Inspección/Validación del Token con Facebook
         validation_url = f"https://graph.facebook.com/debug_token?input_token={access_token}&access_token={FACEBOOK_APP_TOKEN}"
        
         params = {
              "input_token": access_token,       # Token del usuario
              "access_token": FACEBOOK_APP_TOKEN  # Token de la aplicación
         }
        # Hacemos la petición a Facebook
         validation_response = requests.get(validation_url)
         validation_data = validation_response.json()

        # Verifica si la respuesta es válida y pertenece a tu app
         if not validation_data.get("data") or not validation_data["data"]["is_valid"] or validation_data["data"]["app_id"] != FACEBOOK_APP_ID:
             return jsonify({"mensaje": "Token de Facebook inválido o expirado."}), 401

         facebook_user_id = validation_data["data"]["user_id"]
        
        # 2. Obtener datos básicos del perfil (para obtener el email)
         profile_url = f"https://graph.facebook.com/me?fields=id,name,email&access_token={access_token}"
         profile_response = requests.get(profile_url)
         profile_data = profile_response.json()

         user_email = profile_data.get("email") # Puede ser None si el usuario no dio permiso
         user_name = profile_data.get("name")
        
        # 3. Buscar o Crear Usuario en tu Base de Datos
        # Busca por el ID de Facebook
         user = User.query.filter_by(facebook_id=facebook_user_id).first()
        
        # Si no existe, créalo
         if not user:
            # Si el email está disponible, úsalo. Si no, usa el ID de Facebook.
             email_for_db = user_email if user_email else f"fb_{facebook_user_id}@temp.com"
            
            # Intenta encontrar por email si el ID no estaba. (Caso de migración)
             user = User.query.filter_by(email=email_for_db).first()

             if not user:
                # El usuario es completamente nuevo
                 user = User(
                     facebook_id=facebook_user_id,
                     email=email_for_db,
                     name=user_name,
                 )
                 db.session.add(user)
             else:
                 # El usuario ya existía con ese email (ej. Google)
                 user.facebook_id = facebook_user_id # Lo vinculamos
            
             db.session.commit()

        # 4. Generar Token JWT de Sesión
        # Usamos el email del usuario para crear el token de acceso
         access_token = create_access_token(identity=user.email, expires_delta=timedelta(days=7))

         return jsonify({
             "mensaje": "Inicio de sesión con Facebook exitoso.",
             "access_token": access_token,
             "user_id": user.id,
             "user_email": user.email
         })

     except Exception as e:
         db.session.rollback()
         print(f"Error en la autenticación de Facebook: {e}")
         return jsonify({"mensaje": f"Error interno en la autenticación: {e}"}), 500
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


