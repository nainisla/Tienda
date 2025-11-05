import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from "./context/CartContext.jsx"; // ⬅️ Correcto: importado
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import FavoritesView from "./pages/FavoritesView.jsx";
import App from "./components/App.jsx"; // La tienda principal
import AdminPanel from "./pages/AdminPanel.jsx"; // ⬅️ Asegúrate de crear este archivo
import CartView from "./pages/CartView.jsx";
import Tienda from "./pages/Tienda.jsx";
// 🚨 ID DE CLIENTE REAL 🚨
const GOOGLE_CLIENT_ID =
  "194126254993-92flod7jf0859g80vactvoao3s5e4u09.apps.googleusercontent.com";

// 3. Definimos las rutas de la aplicación
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, 
        element: <Tienda />, 
      },
      {
        path: "admin", 
        element: <AdminPanel />, 
      },
      {
        path: "carrito", 
        element: <CartView />,
      }, 
      {
        path: "favoritos", // ⬅️ NUEVA RUTA
        // 🟢 CORRECCIÓN: Se quita la prop 'todosLosProductos={}'
        element: <FavoritesView />, 
      },
    ], 
  }, 
]); 

createRoot(document.getElementById("root")).render(
  <StrictMode>
        {" "}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* 🟢 CLAVE: Envolvemos al RouterProvider con ambos Contextos */}
      <CartProvider>
        <FavoritesProvider> {/* ⬅️ AÑADIDO */}
                <RouterProvider router={router} />
        </FavoritesProvider> {/* ⬅️ AÑADIDO */}
      </CartProvider>
         {" "}
    </GoogleOAuthProvider>
     {" "}
  </StrictMode>
);
