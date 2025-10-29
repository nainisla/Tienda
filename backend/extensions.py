from flask_sqlalchemy import SQLAlchemy
# 🚨 NUEVO: Importar JWTManager 🚨
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
# 🚨 Inicializar la instancia de JWTManager 🚨
jwt = JWTManager()
