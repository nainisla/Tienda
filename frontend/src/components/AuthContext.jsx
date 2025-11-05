// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor (Provider)
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Cargar estado inicial desde localStorage al iniciar la app
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");
    
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
    setLoadingAuth(false);
  }, []);

  // Función de Login unificada (usada por LoginModal)
  const handleLogin = ({ access_token, role }) => {
    localStorage.setItem("userToken", access_token);
    localStorage.setItem("userRole", role);
    setIsLoggedIn(true);
    setUserRole(role);
    console.log("Login exitoso. Token y rol guardados.");
  };

  // Función de Logout (usada por Navbar y AdminPanel)
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    console.log("Sesión cerrada.");
  };

  const contextValue = {
    isLoggedIn,
    userRole,
    loadingAuth,
    handleLogin, 
    handleLogout, 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook Personalizado para usar el Contexto
export const useAuth = () => {
  return useContext(AuthContext);
};