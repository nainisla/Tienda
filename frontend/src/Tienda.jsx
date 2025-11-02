// Tienda.jsx
import React, { useState, useEffect } from "react";
// 🚨 Nota: Debes instalar axios: npm install axios
import axios from "axios";
import { useCart } from "./CartContext"; // Importación correcta

const Tienda = () => {
  // 1. Obtener la función addToCart del contexto
  const { addToCart } = useCart();

  // 2. Estado para almacenar los productos de la API
  const [productos, setProductos] = useState([]);
  const API_URL = "https://localhost:5000/productos"; // Asegúrate de que esta URL sea correcta

  // 3. Lógica para cargar productos al montar el componente
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        // Mapeamos los productos para asegurar que 'precio' sea un número
        setProductos(
          response.data.map((p) => ({
            ...p,
            precio: parseFloat(p.precio), // Convertir el precio a float si viene como string
          }))
        );
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
        // Opcional: Establecer un mensaje de error en el estado
      });
  }, []);

  // 4. Función que se ejecuta al hacer clic en "Agregar al carrito"
  const handleAddToCart = (product) => {
    // Llama a la función del contexto para agregar el producto.
    addToCart(product);
    alert(`¡${product.nombre} añadido al carrito!`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-dark mb-4">Tienda Adidrive</h1>

      <div className="row">
        {/* 5. Iterar sobre la lista de productos y renderizar cada tarjeta */}
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div key={producto.id} className="col-md-4">
              <div className="card shadow-sm p-3 mb-4">
                <img
                  src={producto.imagen}
                  className="card-img-top"
                  alt={producto.nombre}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{producto.nombre}</h5>
                  {/* Mostrar el precio con formato de moneda */}
                  <p className="card-text">${producto.precio.toFixed(2)}</p>

                  {/* 6. Botón de Agregar: Llama a handleAddToCart con el producto actual */}
                  <button
                    className="btn btn-dark w-100"
                    onClick={() => handleAddToCart(producto)}
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Mostrar un mensaje si no hay productos
          <p className="text-center w-100">Cargando productos...</p>
        )}
      </div>
    </div>
  );
};

export default Tienda;
