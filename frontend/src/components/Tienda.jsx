import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; // 🟢 Importamos el hook para obtener el contexto del Outlet
import { useCart } from "../context/CartContext"; 
import { FaRegHeart, FaHeart, FaChevronRight } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";

// 🚨 Asegúrate de que esta URL base sea accesible por HTTPS
const API_BASE_URL = "https://localhost:5000";

// ====================================================================
// 💡 Componente del Botón de Favoritos (Se mantiene igual)
// ====================================================================
const FavoriteButton = ({ productId }) => {
  const { isFavorite, toggleFavorite } = useFavorites(); 
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
            ? <FaHeart size={20} style={{ color: 'black' }} /> // Corazón Lleno (negro)
            : <FaRegHeart size={20} /> // Corazón Vacío (gris/default)
        }
    </button>
  );
};

// ====================================================================
// 💡 Componente Principal
// ====================================================================
const Tienda = () => {
  const { addToCart } = useCart();
  
  // 🟢 CLAVE: Obtenemos los productos cargados desde App.jsx a través del Outlet Context
  const { productos } = useOutletContext(); 

  // Función de ayuda para añadir al carrito
  const handleAddToCart = (producto) => {
    addToCart(producto);
    // Opcional: Mostrar una notificación
    console.log(`Producto ${producto.nombre} agregado al carrito.`);
  };

  if (!productos || productos.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="mb-4">Cargando Productos...</h2>
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="titulo">Nuevos Ingresos</h2>

      {/* 🚨 CATEGORÍAS (Se mantiene igual) */}
      <div className="category-list mb-5">
        <span className="category-item active">TODOS</span>
        <span className="category-item">Camisetas</span>
        <span className="category-item">Pantalones</span>
        <span className="category-item">Accesorios</span>
        <span className="category-item">Buzos</span>
        <span className="category-item">Ver todo <FaChevronRight size={10} /></span>
      </div>

      <div className="row">
        {productos.map((producto) => (
            <div key={producto.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card product-card-new h-100">
                {/* 1. Botón de Favoritos */}
                <FavoriteButton productId={producto.id} />
                
                {/* 2. IMAGEN: Solución del problema de ruta */}
                <img 
                    // 🟢 CLAVE DE SOLUCIÓN 1: Concatenar la URL base con el path de la imagen
                    // Nota: Asume que el backend sirve las imágenes desde /static/
                    src={`${API_BASE_URL}/static/${producto.imagen}`} 
                    className="card-img-top" 
                    alt={producto.nombre} 
                    // Fallback en caso de error de carga
                    onError={(e) => { 
                        e.target.onerror = null; // Previene bucle infinito
                        e.target.src = "https://placehold.co/400x400/CCCCCC/000000?text=No+Image"; // Placeholder
                    }}
                />

                <div className="card-body text-start">
                  {/* 3. Precios y Descuentos */}
                  <p className="price-tag">
                    <span className="current-price">${producto.precio.toFixed(2)}</span>
                    <span className="original-price">${(producto.precio * 2).toFixed(2)}</span> 
                    <span className="discount-badge"> -50%</span> 
                  </p>

                  {/* 4. NOMBRE DEL PRODUCTO: Solución del problema de duplicación */}
                  {/* 🟢 CLAVE DE SOLUCIÓN 2: Solo renderizar el nombre una vez. */}
                  {/* Asegúrate de no tener otro h5 o p con el nombre arriba del card-body */}
                  <h5 className="card-title product-title">{producto.nombre}</h5>
                  <p className="small text-muted mb-3">Originals</p> 

                  {/* 5. Stock */}
                  <p className={`small fw-bold ${producto.stock < 5 && producto.stock > 0 ? 'text-danger' : 'text-success'}`}>
                    Stock: {producto.stock} {producto.stock < 5 && producto.stock > 0 ? '(¡Últimas unidades!)' : (producto.stock === 0 ? 'AGOTADO' : '')}
                  </p>

                  {/* 6. Botón de Agregar */}
                  <button
                    className="btn btn-dark w-100"
                    onClick={() => handleAddToCart(producto)}
                    disabled={producto.stock <= 0} 
                  >
                    {producto.stock <= 0 ? 'AGOTADO' : 'Agregar al Carrito'}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Tienda;