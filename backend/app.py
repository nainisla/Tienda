from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db ,jwt
from models import Producto 
from routes import register_routes 
import os 

# --- Función de Inicialización de Datos ---
def inicializar_db(app):
    """Función para cargar datos de prueba si la base de datos está vacía."""
    with app.app_context():
        if Producto.query.count() == 0:
            # 🚨 CLAVE: Rutas actualizadas para incluir la subcarpeta 'image'
            productos_iniciales = [
                Producto(
                 nombre="Remera Básica Blanca Hombre",
                 precio=19.99,
                 imagen="image/hombre.png",
                 descripcion="Remera de algodón blanca de manga corta, ideal para el uso diario. Corte clásico y tejido suave."
            ),
                Producto(
                 nombre="Buzo de Algodón Gris Hombre",
                 precio=45.00,
                 imagen="image/hombre1.webp",
                 descripcion="Buzo de manga larga color gris oscuro, con cuello redondo y tejido cálido. Perfecto para media estación."
            ),
                Producto(
                 nombre="Remera Manga Larga Blanca Hombre",
                 precio=29.99,
                 imagen="image/hombre2.jpg",
                 descripcion="Remera blanca de manga larga confeccionada en algodón. Comodidad y estilo casual para todos los días."
            ),

# =======================
# 👩 SECCIÓN MUJER
# =======================
                Producto(
                 nombre="Suéter Rayado Beige Mujer",
                 precio=59.99,
                 imagen="image/mujer.webp",
                 descripcion="Suéter tejido con rayas marinas sobre fondo beige. Diseño moderno y confortable para el invierno."
            ),
                Producto(
                 nombre="Buzo Beige de Lana Mujer",
                 precio=64.50,
                 imagen="image/mujer2.webp",
                 descripcion="Buzo de lana color crema, corte holgado y textura suave. Ideal para días fríos con estilo."
            ),

# =======================
# 🧒 SECCIÓN NIÑOS
# =======================
                Producto(
                 nombre="Remera Blanca Niño",
                 precio=15.99,
                 imagen="image/niño.webp",
                 descripcion="Remera básica blanca de algodón para niños. Suave, liviana y perfecta para el uso escolar."
            ),
                Producto(
                 nombre="Pantalón Deportivo Rojo Niño",
                 precio=25.00,
                 imagen="image/niño2.avif",
                 descripcion="Pantalón deportivo rojo con cintura elástica. Cómodo y resistente para jugar y hacer deporte."
            ),
                Producto(
                 nombre="Remera Negra Niño",
                 precio=17.50,
                 imagen="image/niño3.webp",
                 descripcion="Remera básica negra para niños, de algodón y corte regular. Ideal para combinar con cualquier look."
            )

            ]
            db.session.add_all(productos_iniciales)
            db.session.commit()
            print("Datos iniciales de productos cargados.")
        else:
            print(f"La base de datos ya contiene {Producto.query.count()} productos. No se cargaron datos iniciales.")


def create_app(config_class=Config):
    """Factory function para crear la instancia de la aplicación Flask."""
    
    # 🚨 Modificación CLAVE: Indicamos la carpeta estática al crear la aplicación
    # Flask buscará archivos estáticos en esta carpeta, haciéndolos accesibles vía /static/
    app = Flask(__name__, static_folder='static')
    
    # Configuración de CORS
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
    db.init_app(app) 
    jwt.init_app(app)
    
    # 3. Registrar las Rutas y Crear Tablas
    with app.app_context():
        # Verificamos si la carpeta 'static/image' existe, si no, la creamos
        static_image_folder_path = os.path.join(app.root_path, 'static', 'image')
        if not os.path.exists(static_image_folder_path):
            os.makedirs(static_image_folder_path)
            print(f"Carpeta 'static/image' creada en: {static_image_folder_path}")

        register_routes(app)
        db.create_all()
        inicializar_db(app) # Inicializamos los datos
        
    return app

# --- Ejecución Principal ---
# Creamos la instancia global de 'app' para que 'routes.py' la pueda importar si es necesario.
app = create_app()

if __name__ == "__main__":
    try:
        # Asegúrate de ejecutar Flask con SSL: flask run --cert cert.crt --key cert.key
        app.run(
            debug=True, 
            host='0.0.0.0', 
            port=5000, 
            ssl_context=('cert.crt', 'cert.key')
        )
    except Exception as e:
        print(f"Error al ejecutar la aplicación: {e}")
