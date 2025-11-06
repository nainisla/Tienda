import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor (Provider)
export const AuthProvider = ({ children }) => {
  // Estados para la autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' o 'user'

  // Lógica de autenticación que antes estaba en App.jsx
  useEffect(() => {
    // 1. Verificar sesión al montar el componente
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
      // Aquí podrías agregar más lógica de inicialización si es necesario
    }
  }, []);

  // Función de éxito unificada (para ser usada por LoginModal)
  const handleLoginSuccess = ({ access_token, role }) => {
    localStorage.setItem("userToken", access_token);
    localStorage.setItem("userRole", role);
    setIsLoggedIn(true); 
    setUserRole(role); 
    console.log("Login exitoso. Token y rol guardados en contexto.");
  };

  // Función de cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    // Opcional: Recargar la página o redirigir a inicio
    // window.location.href = '/'; 
  };

  // El valor del contexto
  const contextValue = {
    isLoggedIn,
    userRole,
    handleLoginSuccess,
    handleLogout,
    // Proveer setters solo si se necesitan fuera de este contexto.
    setIsLoggedIn,
    setUserRole,
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


