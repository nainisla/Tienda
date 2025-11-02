from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db ,jwt
from models import Producto 
from routes import register_routes # 🚨 Importamos la función de registro de rutas 🚨


# --- Función de Inicialización de Datos ---
def inicializar_db(app):
    """Función para cargar datos de prueba si la base de datos está vacía."""
    with app.app_context():
        if Producto.query.count() == 0:
            productos_iniciales = [
                Producto(
                    nombre="Adidrive X-Run 2.0", 
                    precio=59.99, 
                    imagen="https://via.placeholder.com/300x200?text=Adidrive+X-Run", 
                    descripcion="Zapatillas de running ultraligeras con amortiguación Boost."
                ),
                Producto(
                    nombre="Adidrive Classic Pro", 
                    precio=85.50, 
                    imagen="https://via.placeholder.com/300x200?text=Adidrive+Classic", 
                    descripcion="Diseño retro, comodidad para el día a día."
                ),
                Producto(
                    nombre="Adidrive TrailBlazer", 
                    precio=110.00, 
                    imagen="https://via.placeholder.com/300x200?text=Adidrive+Trail", 
                    descripcion="Resistentes al agua, perfectas para senderismo."
                ),
            ]
            db.session.add_all(productos_iniciales)
            db.session.commit()
            print("Base de datos inicializada con productos de prueba.")
        else:
            print("La base de datos ya contiene productos.")

# --- Función para crear la instancia de la aplicación (Patrón de Fábrica) ---
def create_app(config_class=Config):
    app = Flask(__name__)
    @app.after_request
    def add_security_headers(response):
        # Permite el uso de la API de gestión de credenciales (usada por Google/navegador)
        response.headers['Permissions-Policy'] = 'identity-credentials-get=()' 
        return response
    CORS(
        app, 
        # Añadimos la IP de la red por si el navegador la usa
        resources={r"/*": {"origins": [
            "https://localhost:5173", 
            "https://127.0.0.1:5173",
            "https://192.168.0.110:5173" 
        ]}},
        allow_headers=["Content-Type", "Authorization"], 
        supports_credentials=True, 
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )
    
    # 1. Cargar la configuración
    app.config.from_object(config_class)
    
    # 2. Inicializar extensiones
    db.init_app(app) # ⬅️ Vinculamos la instancia 'db' a la aplicación 'app'
    jwt.init_app(app)
    
    # 3. Registrar las Rutas y Crear Tablas
    with app.app_context():
        register_routes(app) # 🚨 Llamamos a la función de routes.py para registrar rutas
        db.create_all()
        inicializar_db(app) # Inicializamos los datos
        
    return app

# --- Ejecución Principal ---
# Creamos la instancia global de 'app' para que 'routes.py' la pueda importar si es necesario.
app = create_app()

if __name__ == "__main__":
    try:
        app.run(
            debug=True, 
            host='0.0.0.0', 
            port=5000, 
            ssl_context=('cert.crt', 'cert.key') # 🌟 USAR TUS CERTIFICADOS
        )
    except FileNotFoundError:
        print("🚨 ERROR: Asegúrate de que los archivos 'cert.crt' y 'cert.key' estén en la misma carpeta que 'app.py'.")
    except Exception as e:
        print(f"Error al iniciar el servidor Flask: {e}")