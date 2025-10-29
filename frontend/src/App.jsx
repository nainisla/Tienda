import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import LumineLogo from "./assets/lumini.jpg";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal.jsx";
// 🚨 ÍCONOS IMPORTADOS
import { FaUser, FaRegUser, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { useCart } from "./CartContext"; // ⬅️ Usamos el estado global
import Tienda from "./Tienda.jsx"; // ⬅️ Importamos Tienda

// ----------------------------------------------------
// 💡 COMPONENTE REUTILIZABLE PARA EL CONTADOR (BADGE)
// ----------------------------------------------------
const Badge = ({ count }) => {
  let displayCount;
  // 🟢 CLAVE: Si count es 0 (carrito vacío), retorna null y el círculo desaparece.
  if (count === 0) {
    return null;
  } else if (count > 5) {
    displayCount = "+5";
  } else {
    displayCount = count;
  }

  // Asegúrate de que .icon-badge esté definido en tu App.css
  // Si totalItems > 0, este span se renderiza y oculta el fondo del ícono (si lo tiene).
  return <span className="icon-badge">{displayCount}</span>;
};
// ----------------------------------------------------

function App() {
  const [productos, setProductos] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // 🟢 OBTENEMOS EL VALOR ACTUAL DEL CARRITO (total de ítems)
  const { totalItems } = useCart();

  // 🚨 ELIMINADOS: El estado [cartCount, setCartCount] y la función handleAddToCart

  // 🚨 ESTADOS PARA LOS CONTADORES (Se mantienen)
  const [notificationCount, setNotificationCount] = useState(0); // Para el perfil/notificaciones
  const [favoritesCount, setFavoritesCount] = useState(0); // Para el corazón

  const handleClose = () => setShowLoginModal(false);

  // Función para abrir el modal
  const handleShow = (e) => {
    if (e) e.preventDefault();
    setShowLoginModal(true);
  };

  // 🚨 FUNCIÓN DE CERRAR SESIÓN MODIFICADA (Se mantiene igual)
  const handleLogout = (e) => {
    if (e) e.preventDefault();
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    setNotificationCount(0);
    console.log("Sesión cerrada.");
  };

  // 🚨 UNIFICACIÓN DE USEEFFECT MODIFICADA (Se mantiene igual)
  useEffect(() => {
    // 1. Verificar sesión al cargar
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
      // 🚨 Simulación de contadores si el usuario ya tiene sesión:
      setNotificationCount(3);
      setFavoritesCount(6);
    }

    // 2. Cargar productos (Esta lógica debe ir en Tienda.jsx si App.jsx es solo el layout)
    // Dejo el código aquí, pero el renderizado de productos debe estar en Tienda.jsx
    axios
      .get("http://127.0.0.1:5000/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  // 🚨 FUNCIÓN DE RENDERIZADO DE TARJETA (¡PELIGRO! Esta función debe ir en Tienda.jsx y usar el addToCart real)
  // La mantengo con una advertencia, ya que estás renderizando productos aquí:
  const renderProductCard = (p) => (
    <div key={p.id} className="card">
      <img src={p.imagen} alt={p.nombre} className="card-img" />
      <div className="card-body">
        <h3 className="card-title">{p.nombre}</h3>
        <p className="card-description">{p.descripcion}</p>
        <p className="card-price">${p.precio.toFixed(2)}</p>
        <button
          className="add-to-cart"
          // 🚨 ADVERTENCIA: Esta llamada a la función está INCORRECTA si el botón no está en Tienda.jsx
          onClick={() =>
            console.error(
              "¡ERROR! El botón de agregar producto NO debe estar en App.jsx. Muévelo a Tienda.jsx y usa el 'addToCart' real."
            )
          }
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );

  return (
    <div className="container">
      {/* Navbar */}
      <header className="navbar">
        {/* Parte Izquierda: Logo y Menú Principal (Se mantiene igual) */}
        <div className="nav-links-left">
          <div className="logo-container">
            <Link to="/">
              <img src={LumineLogo} alt="Lúmine Logo" className="logo-img" />
            </Link>
          </div>
          <nav>
            <a href="#">HASTA 30% OFF</a>
            <a href="#">CALZADO</a>
            <a href="#">MUJER</a>
            <a href="#">HOMBRE</a>

            {/* 🚨 ADMIN LINK CONDICIONAL */}
            {isLoggedIn && userRole === "admin" && (
              <Link to="/admin" className="admin-link">
                ADMIN
              </Link>
            )}
          </nav>
        </div>

        {/* Parte Derecha: Búsqueda e Íconos */}
        <div className="nav-links-right">
          <div className="search-bar">
            <input type="text" placeholder="Buscar..." />
            <span>🔍</span>
          </div>

          {/* 🚨 ÍCONO DE PERSONA (Se mantiene igual) */}
          <a
            href="#"
            onClick={isLoggedIn ? handleLogout : handleShow}
            className="nav-link-item icon-button"
            title={isLoggedIn ? "Cerrar Sesión" : "Cuenta"}
          >
            {isLoggedIn ? <FaUser size={20} /> : <FaRegUser size={20} />}
            {isLoggedIn && <Badge count={notificationCount} />}
          </a>

          {/* 🚨 ÍCONO DE DESEADOS/FAVORITOS (Se mantiene igual) */}
          <a href="#" className="nav-link-item icon-button" title="Deseados">
            <FaRegHeart size={20} />
            <Badge count={favoritesCount} />
          </a>

          {/* 🚨 ÍCONO DE CARRITO (BOLSO) */}
          <Link
            to="/carrito"
            className="nav-link-item icon-button"
            title="Carrito"
          >
            <FaShoppingBag size={20} />
            {/* 🟢 CLAVE: Usa totalItems. Si es 0, no se renderiza el círculo negro. */}
            <Badge count={totalItems} />
          </Link>
        </div>
      </header>
      {/* 🟢 El componente Tienda debería manejar su propio renderizado */}
      {/* <h2 className="titulo">Nuevas colecciones</h2>
      <div className="productos">
        {productos.length > 0 ? (
          productos.map(renderProductCard)
        ) : (
          <p className="text-center w-100">
            Cargando productos o la tienda está vacía...
          </p>
        )}
      </div> */}
      {/* 💡 Sugerencia: Si App.jsx es tu Layout, es mejor que se renderice aquí el contenido
          de la ruta principal. Si el Router solo usa App.jsx para la ruta '/', 
          deberías considerar mover el Navbar y el resto a un Layout Component 
          y usar el <Outlet /> de React Router. */}
      <Tienda /> {/* ⬅️ Renderizamos el componente Tienda */}
      {/* 🚨 Incluir el componente LoginModal */}
      <LoginModal
        show={showLoginModal}
        handleClose={handleClose}
        setIsLoggedIn={setIsLoggedIn}
        setUserRole={setUserRole}
      />
    </div>
  );
}

export default App;
