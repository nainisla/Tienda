import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import LumineLogo from "./assets/lumini.jpg";
// ⬅️ 1. Importar el componente Link para la navegación interna
import { Link } from "react-router-dom"; 

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  return (
    // Nota: El contenido principal de la tienda debe estar dentro de un componente 
    // <main> si quieres usar un Layout que envuelva la navbar y el footer. 
    // Por ahora, lo mantenemos como <div>.

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
                  <Link to="/admin" className="admin-link">ADMIN</Link>
              </nav>
          </div>

          {/* Parte Derecha: Búsqueda y Carrito/Cuenta */}
          <div className="nav-links-right">
              <div className="search-bar">
                  <input type="text" placeholder="Buscar..." />
                  <span>🔍</span> 
              </div>
              <a href="#">Cuenta</a> 
              <a href="#">🛒 (1)</a>
          </div>
      </header>
      
      {/* El resto del contenido de la tienda sigue aquí */}
      <h2 className="titulo">Nuevas colecciones</h2>
      
      <div className="productos">
        {productos.map((p) => (
          <div key={p.id} className="card">
            {/* ... Renderizado de la tarjeta del producto ... */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;