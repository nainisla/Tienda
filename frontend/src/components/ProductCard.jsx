// src/components/ProductCard.jsx
import React from 'react';
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const API_BASE_URL = "https://127.0.0.1:5000";

// Componente de Botón de Favoritos
const FavoriteButton = ({ productId }) => {
  const { isFavorite, toggleFavorite } = useFavorites(); 
  // ... (lógica del botón)
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(productId); 
  };
  const isProductFavorite = isFavorite(productId);

  return (
    <button 
        className="favorite-button" 
        title="Añadir a Deseados"
        onClick={handleToggleFavorite}
    >
        {isProductFavorite
            ? <FaHeart size={20} style={{ color: 'black' }} />
            : <FaRegHeart size={20} />
        }
    </button>
  );
};


const ProductCard = ({ producto }) => {
  const { addToCart } = useCart();
  const fullImageUrl = `${API_BASE_URL}/static/${producto.imagen}`;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(producto);
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card product-card-new h-100">
        
        <FavoriteButton productId={producto.id} />

        <img 
          // 🚨 AHORA SOLO USAMOS fullImageUrl
          src={fullImageUrl || 'https://via.placeholder.com/300x400?text=Lumine+Product'} 
          className="card-img-top" 
          alt={producto.nombre} 
        />

        <div className="card-body text-start">
          {/* ... (Precios y títulos) ... */}
          <p className="price-tag">
            <span className="current-price">${producto.precio.toFixed(2)}</span>
            <span className="original-price">
              ${(producto.precio * 2).toFixed(2)}
            </span>
            <span className="discount-badge"> -50%</span>
          </p>
          <h5 className="card-title product-title">{producto.nombre}</h5>
          <p className="small text-muted mb-3">Originals</p>

          {/* Stock y Botón */}
          <p className={`small fw-bold ${
              producto.stock < 5 && producto.stock > 0 ? 'text-danger' : 'text-success'
            }`}>
            Stock: {producto.stock} {producto.stock < 5 && producto.stock > 0 ? '(¡Últimas unidades!)' : (producto.stock === 0 ? 'AGOTADO' : '')}
          </p>
          <button
            className="btn btn-dark w-100"
            onClick={handleAddToCart}
            disabled={producto.stock <= 0}
          >
            {producto.stock <= 0 ? 'AGOTADO' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;