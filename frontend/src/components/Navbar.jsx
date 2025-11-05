import React from 'react';
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal.jsx";
import { FaUser, FaRegUser, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext"; // ⬅️ IMPORTANTE: Ajustar la ruta
import LumineLogo from "../assets/lemini.png"; // ⬅️ IMPORTANTE: Ajustar la ruta
import { useFavorites } from "../context/FavoritesContext";


// (Incluye aquí el componente 'Badge' si lo definiste dentro de App.jsx)
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


const Navbar = ({ showLoginModal, handleShow, handleClose, isLoggedIn, setIsLoggedIn, setUserRole, userRole, handleLogout }) => {
  // 1. Usa el hook de contexto
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();

  return (
    <>
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
            <a href="#">NIÑOS</a>

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
            {isLoggedIn && <Badge count={totalItems} />}
          </a>

          {/* 🚨 ÍCONO DE DESEADOS/FAVORITOS (Se mantiene igual) */}
          <Link to="/favoritos" className="nav-link-item icon-button" title="Deseados">
            <FaRegHeart size={20} />
            {/* 🟢 CLAVE 2: Usa el contador real del contexto */}
            <Badge count={totalFavorites} /> 
          </Link>

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

      {/* 🚨 Incluir el componente LoginModal fuera del header */}
      <LoginModal
        show={showLoginModal}
        handleClose={handleClose}
        setIsLoggedIn={setIsLoggedIn}
        setUserRole={setUserRole}
      />
    </>
  );
};

export default Navbar;


