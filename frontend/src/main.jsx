import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from "./context/CartContext.jsx"; 
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import FavoritesView from "./components/FavoritesView.jsx";
import App from "./components/App.jsx"; 
import AdminPanel from "./components/AdminPanel.jsx"; 
import CartView from "./components/CartView.jsx";
import Tienda from "./components/Tienda.jsx";
import Checkout from "./components/Checkout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
// 🚨 ID DE CLIENTE REAL 🚨
const GOOGLE_CLIENT_ID =
  "194126254993-92flod7jf0859g80vactvoao3s5e4u09.apps.googleusercontent.com";

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
        path: "favoritos", 
        element: <FavoritesView />, 
      },
      {
        path: "checkout", 
        element: <Checkout />, 
      },
    ], 
  }, 
]); 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* 🟢 CLAVE: Envolver con AuthProvider */}
      <AuthProvider> 
        <CartProvider>
          <FavoritesProvider>
            <RouterProvider router={router} />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
