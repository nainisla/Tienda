import React, { createContext, useState, useContext } from "react";

// 1. Crear el Contexto
const CartContext = createContext();

// 2. Crear el Proveedor (Provider)
export const CartProvider = ({ children }) => {
  // Estado para almacenar los productos en el carrito: [{id, nombre, precio, cantidad}]
  const [cartItems, setCartItems] = useState([]);

  // --- Función Principal: Agregar/Actualizar Producto ---
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // 1. Buscar si el producto ya existe en el carrito
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // 2. Si existe, incrementar la cantidad
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // 3. Si no existe, agregarlo con cantidad 1
        return [...prevItems, { ...product, cantidad: 1 }];
      }
    });
  };

  // --- Función para Quitar Producto (ej. de un botón "X") ---
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // --- Función para Vaciar el Carrito ---
  const clearCart = () => {
    setCartItems([]);
  };

  // El valor que se proveerá a todos los componentes que usen el contexto
  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    // Opcional: Calcular el total de artículos
    totalItems: cartItems.reduce((acc, item) => acc + item.cantidad, 0),
    // Opcional: Calcular el costo total
    totalPrice: cartItems
      .reduce((acc, item) => acc + item.precio * item.cantidad, 0)
      .toFixed(2),
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// 3. Crear un Hook personalizado para facilitar el uso
export const useCart = () => {
  return useContext(CartContext);
};
