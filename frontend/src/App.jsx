import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import LumineLogo from "./assets/lumini.jpg";
// ⬅️ 1. Importar el componente Link para la navegación interna
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal.jsx";

function App() {
  const [productos, setProductos] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClose = () => setShowLoginModal(false);
  // 🚨 CORRECCIÓN: handleShow ahora recibe el evento 'e' y evita la recarga de la página
  const handleShow = (e) => {
    if (e) e.preventDefault();
    setShowLoginModal(true);
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  // Función de renderizado de tarjeta de producto (para mantener App.jsx limpio)
  const renderProductCard = (p) => (
    <div key={p.id} className="card">
      <img src={p.imagen} alt={p.nombre} className="card-img" />
      <div className="card-body">
        <h3 className="card-title">{p.nombre}</h3>
        <p className="card-description">{p.descripcion}</p>
        <p className="card-price">${p.precio.toFixed(2)}</p>
        <button className="add-to-cart">Agregar al Carrito</button>
      </div>
    </div>
  );

  return (
    <div className="container">
      {/* Navbar con nuevo diseño tipo Adidas */}
      <header className="navbar">
        {/* Parte Izquierda: Logo y Menú Principal */}
        <div className="nav-links-left">
          <div className="logo-container">
            {/* 2. El logo también debe ser un enlace a la página de inicio */}
            <Link to="/">
              <img src={LumineLogo} alt="Lúmine Logo" className="logo-img" />
            </Link>
          </div>
          <nav>
            {/* Mantener enlaces a '#' por ahora si no hay rutas específicas */}
            <a href="#">HASTA 30% OFF</a>
            <a href="#">CALZADO</a>
            <a href="#">MUJER</a>
            <a href="#">HOMBRE</a>
            {/* 3. Usamos Link para el Panel Administrativo */}
            <Link to="/admin" className="admin-link">
              ADMIN
            </Link>
          </nav>
        </div>

        {/* Parte Derecha: Búsqueda y Carrito/Cuenta (ESTRUCTURA CORREGIDA) */}
        <div className="nav-links-right">
          <div className="search-bar">
            <input type="text" placeholder="Buscar..." />
            <span>🔍</span>
          </div>
          {/* 🚨 Llamamos a handleShow() que abre el Modal */}
          <a href="#" onClick={handleShow} className="nav-link-item">
            Cuenta
          </a>
          <a href="#">🛒 (1)</a>
        </div>
      </header>{" "}
      {/* ⬅️ Cierre correcto de header */}
      {/* El resto del contenido de la tienda sigue aquí */}
      <h2 className="titulo">Nuevas colecciones</h2>
      <div className="productos">
        {productos.length > 0 ? (
          productos.map(renderProductCard)
        ) : (
          <p className="text-center w-100">
            Cargando productos o la tienda está vacía...
          </p>
        )}
      </div>
      {/* 🚨 Incluir el componente LoginModal al final del render */}
      <LoginModal show={showLoginModal} handleClose={handleClose} />
    </div>
  );
}

export default App;
