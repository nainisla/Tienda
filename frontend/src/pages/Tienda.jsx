import React, { useState, useEffect } from "react";
import axios from "axios"; // ⬅️ Descomentado para usar el backend
import { useCart } from "../context/CartContext"; 
import { FaRegHeart, FaHeart, FaChevronRight } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";

// 🚨 Asegúrate de que esta URL base sea accesible por HTTPS
const API_URL = "https://localhost:5000/productos"; 
const API_BASE_URL = "https://localhost:5000";

const FavoriteButton = ({ productId }) => {
  // 🚨 Esto es la clave: obtener la lógica del contexto global
  const { isFavorite, toggleFavorite } = useFavorites(); 

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    // Llamar a la función del contexto para agregar/quitar
    toggleFavorite(productId); 
  };
  const isProductFavorite = isFavorite(productId);

  return (
    <button 
        className="favorite-button" 
        title="Añadir a Deseados"
        onClick={handleToggleFavorite}
    >
        {/* 🚨 2. Renderiza el ícono según el estado */}
        {isProductFavorite
            ? <FaHeart size={20} style={{ color: 'black' }} /> // Corazón Lleno (negro)
            : <FaRegHeart size={20} /> // Corazón Vacío (gris/default)
        }
    </button>
  );
};

const Tienda = () => {
  const { addToCart } = useCart();

  // El stock debe formar parte del estado de los productos
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Lógica para cargar productos al montar el componente
  const fetchProductos = () => {
    setLoading(true);
    setError(null);
    axios
      .get(API_URL)
      .then((response) => {
        // Mapeamos los productos para asegurar que 'precio' y 'stock' sean números
        setProductos(
          response.data.map((p) => ({
            ...p,
            precio: parseFloat(p.precio),
            // 🚨 Asumiendo que tu backend ya devuelve un campo 'stock'
            stock: p.stock !== undefined ? parseInt(p.stock, 10) : 10, // 10 si no viene de la API
          }))
        );
      })
      .catch((err) => {
        console.error("Error al obtener los productos:", err);
        setError("Error al cargar los productos. ¿Está el backend corriendo?");
        // Opcional: Cargar mock si el backend falla (para desarrollo)
        // setProductos(mockProductos); 
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 4. Función que se ejecuta al hacer clic en "Agregar al carrito"
  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert(`¡${product.nombre} está agotado!`);
      return;
    }

    // 🚨 Lógica de descuento de stock (Simula la actualización en DB)
    // ⚠️ NOTA: En producción, deberías hacer una llamada POST a tu API
    // para que la DB haga el descuento antes de actualizar el frontend.
    
    // Descontar stock localmente para actualizar la UI inmediatamente
    setProductos(prevProductos => 
        prevProductos.map(p => 
            p.id === product.id ? { ...p, stock: p.stock - 1 } : p
        )
    );

    // Llama a la función del contexto para agregar el producto.
    addToCart(product);
    alert(`¡${product.nombre} añadido al carrito! Stock restante: ${product.stock - 1}`);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando productos...</p>
      </div>
    );
  }
  
  if (error) {
    return <div className="container mt-5 text-center text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center text-dark mb-4">Tienda Lémini</h1>

      <div className="product-carousel-container">
        {!loading && !error && productos.length > 0 ? (
          productos.map((producto) => (
            // 🚨 REEMPLAZO CLAVE: Se usa "carousel-item-wrapper" en lugar de "col-md-4"
            <div key={producto.id} className="carousel-item-wrapper">
              <div className="card product-card-new shadow-sm mb-4">
              <FavoriteButton productId={producto.id} />
            <img
             src={`${API_BASE_URL}${producto.imagen}`}
             className="card-img-top"
             alt={producto.nombre}
            />
      
            <div className="card-body text-start"> {/* ⬅️ text-start en lugar de text-center */}
        
             {/* 🟢 CRÍTICO: Diseño del Precio (Original/Descuento) */}
             <p className="price-tag">
          {/* Precio Actual (más grande, en rojo) */}
             <span className="current-price">${producto.precio.toFixed(2)}</span>
          {/* Precio Original (tachado, más pequeño) */}
             <span className="original-price">${(producto.precio * 2).toFixed(2)}</span> {/* Simulación de 50% de descuento */}
          {/* Etiqueta de Descuento (opcional) */}
             <span className="discount-badge"> -50%</span> 
             </p>

             <h5 className="card-title product-title">{producto.nombre}</h5>
             <p className="small text-muted mb-3">Originals</p> {/* ⬅️ Simulación de categoría */}

                  {/* 🚨 Mostrar el Stock */}
                  <p className={`small fw-bold ${producto.stock < 5 && producto.stock > 0 ? 'text-danger' : 'text-success'}`}>
                    Stock: {producto.stock} {producto.stock < 5 && producto.stock > 0 ? '(¡Últimas unidades!)' : (producto.stock === 0 ? 'AGOTADO' : '')}
                  </p>

                  {/* 6. Botón de Agregar: Deshabilitado si el stock es 0 */}
                  <button
                    className="btn btn-dark w-100"
                    onClick={() => handleAddToCart(producto)}
                    disabled={producto.stock <= 0} // ⬅️ Deshabilitar si está agotado
                  >
                    {producto.stock <= 0 ? 'AGOTADO' : 'Agregar al Carrito'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-100">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
};

export default Tienda;