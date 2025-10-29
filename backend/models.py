from app import db # Importamos la instancia db creada en app.py
from extensions import db
from datetime import datetime, date

class Producto(db.Model):
    """Modelo de la tabla Producto en la base de datos."""
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Float, nullable=False)
    imagen = db.Column(db.String(200), nullable=True)
    descripcion = db.Column(db.String(300), nullable=True)

    def __repr__(self):
        return f'<Producto {self.nombre}>'
    
# 🚨 NUEVO: Modelo de Usuario 🚨
class User(db.Model):
    """Modelo para usuarios autenticados, ya sea por Google o registro normal."""
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # Se añade un campo para el nombre del usuario
    name = db.Column(db.String(100), nullable=True) 
    # Usado para identificar usuarios de Google y evitar duplicados.
    google_id = db.Column(db.String(200), unique=True, nullable=True) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.email}>'