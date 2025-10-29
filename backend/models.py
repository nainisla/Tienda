from app import db # Importamos la instancia db creada en app.py
from extensions import db

class Producto(db.Model):
    """Modelo de la tabla Producto en la base de datos."""
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Float, nullable=False)
    imagen = db.Column(db.String(200), nullable=True)
    descripcion = db.Column(db.String(300), nullable=True)

    def __repr__(self):
        return f'<Producto {self.nombre}>'