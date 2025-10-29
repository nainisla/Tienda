import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// 1. Importamos React Router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 2. Importamos los componentes de la aplicación
import App from './App.jsx'; // La tienda principal
import AdminPanel from './AdminPanel.jsx'; // ⬅️ Asegúrate de crear este archivo


// 3. Definimos las rutas de la aplicación
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Ruta principal: http://localhost:5173/
  },
  {
    path: "/admin",
    element: <AdminPanel />, // Ruta del panel: http://localhost:5173/admin
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 4. Usamos RouterProvider para habilitar la navegación */}
    <RouterProvider router={router} /> 
  </StrictMode>,
);