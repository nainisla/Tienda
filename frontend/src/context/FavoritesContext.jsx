import React, { createContext, useState, useContext } from "react";

// 1. Crear el Contexto
const FavoritesContext = createContext();

// 2. Crear el Proveedor (Provider)
export const FavoritesProvider = ({ children }) => {
  // Estado para almacenar los IDs de los productos favoritos
  const [favoriteItems, setFavoriteItems] = useState([]);

  // --- Función Principal: Agregar/Quitar de Favoritos ---
  const toggleFavorite = (productId) => {
    setFavoriteItems((prevItems) => {
      // 1. Buscar si el producto ya existe en favoritos
      const isCurrentlyFavorite = prevItems.includes(productId);

      if (isCurrentlyFavorite) {
        // 2. Si existe, lo quitamos
        return prevItems.filter((id) => id !== productId);
      } else {
        // 3. Si no existe, lo agregamos
        return [...prevItems, productId];
      }
    });
  };

  // Función para verificar si un producto es favorito
  const isFavorite = (productId) => {
    return favoriteItems.includes(productId);
  };

  // El valor que se proveerá a todos los componentes que usen el contexto
  const contextValue = {
    favoriteItems,
    toggleFavorite,
    isFavorite,
    // Opcional: Calcular el total de artículos (para el Navbar)
    totalFavorites: favoriteItems.length,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

// 3. Hook Personalizado para usar el Contexto
export const useFavorites = () => {
  return useContext(FavoritesContext);
};