import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import Navbar from "../components/Navbar.jsx";
import { Link, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";
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
    }

    // 2. Cargar productos (Esta lógica debe ir en Tienda.jsx si App.jsx es solo el layout)
    // Dejo el código aquí, pero el renderizado de productos debe estar en Tienda.jsx
    axios
      .get("https://127.0.0.1:5000/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  return (
    <>
      {/* 1. Renderizar el Navbar y pasarle los props de autenticación */}
      <Navbar
        showLoginModal={showLoginModal}
        handleShow={handleShow}
        handleClose={handleClose}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setUserRole={setUserRole}
        userRole={userRole}
        handleLogout={handleLogout}
      />

      {/* 2. El Outlet es donde React Router inyecta el contenido de la ruta actual */}
      <main className="content-area">
        {/* 🟢 CLAVE: Pasamos el estado 'productos' a todos los children a través del contexto del Outlet */}
        <Outlet context={{ productos }} /> 
      </main>
    </>
  );
} // <-- El cierre de la función App
  

export default App;
