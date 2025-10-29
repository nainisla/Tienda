class Config:
    """Configuración base de Flask y SQLAlchemy."""
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:///tienda.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False 
    JWT_SECRET_KEY = "tu_super_secreto_y_seguro"