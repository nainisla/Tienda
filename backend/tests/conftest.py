import pytest
from flask import Flask
from extensions import db, jwt  
from routes import register_routes

@pytest.fixture
def client(tmp_path):
    """Crea una app Flask para testing con DB y JWT configurados."""
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{tmp_path}/test.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "clave_de_prueba_super_segura"


    db.init_app(app)
    jwt.init_app(app) 

    with app.app_context():
        db.create_all()

    register_routes(app)

    with app.test_client() as client:
        yield client

    with app.app_context():
        db.drop_all()
