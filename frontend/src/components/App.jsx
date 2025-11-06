// src/components/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import Navbar from "../components/Navbar.jsx";
import LoginModal from "./LoginModal.jsx"; // ⬅️ DEBES IMPORTAR EL MODAL
import { Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext.jsx"; // ⬅️ Correcto

const Badge = ({ count }) => {
  let displayCount;
  if (count === 0) {
    return null;
  } else if (count > 5) {
    displayCount = "+5";
  } else {
    displayCount = count;
  }

  return <span className="icon-badge">{displayCount}</span>;
};
// ----------------------------------------------------

function App() {
  const [productos, setProductos] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); 

  // 🟢 CLAVE: USAR SOLO EL CONTEXTO
  // Eliminamos los useState de isLoggedIn y userRole
  const { isLoggedIn, userRole, handleLogout } = useAuth();

  const { totalItems } = useCart();

  const handleClose = () => setShowLoginModal(false);

  // Función para abrir el modal
  const handleShow = (e) => {
    if (e) e.preventDefault();
    setShowLoginModal(true);
  };

  // 🚨 Eliminamos la función local handleLogout; ahora viene del hook useAuth.

  useEffect(() => {
    // 2. Cargar productos
    axios
      .get("https://localhost:5000/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
      
    // 🚨 Simulación de contadores si el usuario ya tiene sesión (opcional)
    if(isLoggedIn) {
        setNotificationCount(3);
    }
  }, [isLoggedIn]); // ⬅️ El array de dependencias es crucial

  return (
    <>
      {/* 1. Renderizar el Navbar y pasarle los props necesarios */}
      <Navbar
        handleShow={handleShow}
        // 🚨 Solo pasamos las props que manejan el modal y las del contexto:
        isLoggedIn={isLoggedIn} 
        userRole={userRole}
        handleLogout={handleLogout}
      />

      {/* 2. El Outlet es donde React Router inyecta el contenido de la ruta actual */}
      <main className="content-area">
        {/* 🟢 CLAVE: Pasamos el estado 'productos' a todos los children a través del contexto del Outlet */}
        <Outlet context={{ productos }} /> 
      </main>

      {/* 3. El modal debe estar aquí para que se muestre sobre todo el contenido */}
      <LoginModal
        show={showLoginModal}
        handleClose={handleClose}
      />
    </>
  );
}

export default App;