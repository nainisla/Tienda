import React from 'react';

const AdminPanel = () => {
  return (
    <div className="container mt-5">
      <h1 className="titulo">Panel Administrativo</h1>
      <p>Bienvenido al área de gestión de Lúmine.</p>
      
      <div className="d-flex mb-4">
        <button className="btn btn-dark me-3">➕ Agregar Nuevo Producto</button>
        <button className="btn btn-outline-dark">🛠️ Gestionar Usuarios</button>
      </div>

      <h3>Listado Rápido de Productos</h3>
      {/* Aquí podrías cargar los productos de la API para editarlos */}
      <div className="card p-3">
          <p>La lista de gestión se cargará aquí...</p>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
                Producto Dummy 1 
                <div>
                    <button className="btn btn-sm btn-primary me-2">Editar</button>
                    <button className="btn btn-sm btn-danger">Eliminar</button>
                </div>
            </li>
          </ul>
      </div>

    </div>
  );
};

export default AdminPanel;