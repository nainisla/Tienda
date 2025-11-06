import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { FaHeart, FaShoppingBag } from "react-icons/fa";

const API_BASE_URL = "https://localhost:5000";

const FavoritesView = () => {
  const { favoriteItems, toggleFavorite } = useFavorites();
  // 🟢 CLAVE: Obtener los productos cargados en App.jsx
  const { productos: todosLosProductos } = useOutletContext();
  const { addToCart } = useCart(); // ⬅️ NUEVO: Obtener la función para agregar al carrito

  // 🚨 Usamos la lista de todos los productos para obtener los detalles
  const favoriteProducts = todosLosProductos.filter((p) =>
    favoriteItems.includes(Number(p.id))
  );
  if (favoriteProducts.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="mb-4">🖤 Tu Lista de Deseados está Vacía</h2>
        <p>
          Aún no has marcado ningún artículo como favorito. ¡Empieza a soñar!
        </p>
        <Link to="/" className="btn btn-dark mt-3">
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        Mis Artículos Deseados ({favoriteProducts.length})
      </h2>
      <div className="row">
        {favoriteProducts.map((p) => (
          <div key={p.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className="card product-card-new h-100">
              {/* Botón de Quitar de Favoritos */}
              <button
                className="favorite-button"
                onClick={() => toggleFavorite(p.id)}
                title="Quitar de Deseados"
              >
                <FaHeart size={20} style={{ color: "black" }} />
              </button>

              <img 
                 // ✅ SOLUCIÓN: Concatenación manual para incluir el directorio "static"
                 src={`${API_BASE_URL}/static/${p.imagen}`} 
                 className="card-img-top" 
                 alt={p.nombre} 
              />

              <div className="card-body text-start">
                <p className="price-tag">
                  <span className="current-price">${p.precio.toFixed(2)}</span>
                </p>
                <h5 className="card-title product-title">{p.nombre}</h5>
                <p className="small text-muted mb-3">Originals</p>

                {/* Botón de Mover al Carrito (Lógica implementada) */}
                <button
                  className="btn btn-outline-dark btn-sm w-100 mt-2"
                  onClick={() => {
                    addToCart(p); // 1. Agrega el producto al carrito
                    toggleFavorite(p.id); // 2. Lo quita de favoritos
                  }}
                >
                  <FaShoppingBag size={14} className="me-2" />
                  Mover al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesView;
