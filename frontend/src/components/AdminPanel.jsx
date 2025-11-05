import React from 'react';
import { useAuth } from '../context/AuthContext'; // ⬅️ IMPORTAR useAuth
import { Navigate } from 'react-router-dom'; // ⬅️ IMPORTAR Navigate

const AdminPanel = () => {
  const { userRole, loadingAuth } = useAuth(); // 🟢 Obtener rol y estado de carga

  if (loadingAuth) {
    // 1. Mostrar un spinner mientras se carga el rol
    return (
        <div className="container mt-5 text-center">
            <h1 className="titulo">Cargando...</h1>
            <p>Verificando permisos de acceso.</p>
        </div>
    );
  }

  if (userRole !== 'admin') {
    // 2. Si el rol NO es admin, redirigir a la página principal
    console.warn(`Acceso denegado. Rol: ${userRole}`);
    // Usamos Navigate para redirigir si el usuario intenta acceder directamente
    return <Navigate to="/" replace />;
  }

  // 3. Si el rol es 'admin', renderizar el panel
  return (
    <div className="container mt-5">
      <h1 className="titulo">Panel Administrativo</h1>
      <p>Bienvenido al área de gestión de Lúmine.</p>
      
      <div className="d-flex mb-4">
        <button className="btn btn-dark me-3">➕ Agregar Nuevo Producto</button>
        <button className="btn btn-outline-dark">🛠️ Gestionar Usuarios</button>
      </div>

      {/* ... (Resto del contenido del panel se mantiene igual) ... */}
    </div>
  );
};

export default AdminPanel;