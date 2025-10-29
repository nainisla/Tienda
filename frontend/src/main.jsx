import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from "./CartContext.jsx"; // ⬅️ Correcto: importado
import CartView from "./CartView.jsx";

// 1. Importamos React Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// 2. Importamos los componentes de la aplicación
import App from "./App.jsx"; // La tienda principal
import AdminPanel from "./AdminPanel.jsx"; // ⬅️ Asegúrate de crear este archivo
// 🚨 ID DE CLIENTE REAL 🚨
const GOOGLE_CLIENT_ID =
  "194126254993-92flod7jf0859g80vactvoao3s5e4u09.apps.googleusercontent.com";

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
  {
    path: "/carrito", // ⬅️ NUEVA RUTA
    element: <CartView />, // ⬅️ VISTA DEL CARRITO
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
        {/* 🚨 4. Envolvemos toda la aplicación con el Provider de Google */}
       {" "}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* 🟢 CORRECCIÓN: CartProvider debe envolver al RouterProvider */}
      <CartProvider>
              <RouterProvider router={router} />
      </CartProvider>
         {" "}
    </GoogleOAuthProvider>
     {" "}
  </StrictMode>
);
