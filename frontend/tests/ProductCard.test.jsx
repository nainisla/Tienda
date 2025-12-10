import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import ProductCard from "../src/components/ProductCard.jsx";
import { CartProvider } from "../src/context/CartContext";
import { FavoritesProvider } from "../src/context/FavoritesContext";

test('muestra el mensaje "¡Últimas unidades!" cuando el stock es bajo (por ejemplo: 3)', () => {
  render(
    <CartProvider>
      <FavoritesProvider>
        <ProductCard
          producto={{
            id: 1,
            nombre: "Zapatillas Urbanas Clásicas",
            precio: 75,
            imagen: "product1.jpg",
            stock: 3,
          }}
        />
      </FavoritesProvider>
    </CartProvider>
  );
  const warningText = screen.getByText(/últimas unidades/i);
  expect(warningText).toBeInTheDocument();
});




test('agrega el producto al carrito cuando se hace clic', () => {
  render(
    <CartProvider>
      <FavoritesProvider>
        <ProductCard
          producto={{
            id: 1,
            nombre: "Zapatillas",
            precio: 75,
            imagen: "product1.jpg",
            stock: 10,
          }}
        />
      </FavoritesProvider>
    </CartProvider>
  );
  const button = screen.getByRole("button", { name: /agregar/i });
  expect(button).toBeInTheDocument();
});




test("muestra el producto como favorito si está en favoritos", () => {
  render(
    <CartProvider>
      <FavoritesProvider initialFavorites={[1]}>
        <ProductCard
          producto={{
            id: 1,
            nombre: "Zapatillas",
            precio: 75,
            imagen: "",
            stock: 5,
          }}
        />
      </FavoritesProvider>
    </CartProvider>
  );
  expect(screen.getByTestId("favorite-icon")).toBeInTheDocument();
});




test("desactiva el botón si el stock es 0", () => {
  render(
    <CartProvider>
      <FavoritesProvider>
        <ProductCard
          producto={{
            id: 1,
            nombre: "Zapatillas",
            precio: 75,
            imagen: "",
            stock: 0,
          }}
        />
      </FavoritesProvider>
    </CartProvider>
  );
  const button = screen.getByRole("button", { name: /agregar/i });
  expect(button).toBeDisabled();
});


test("muestra el nombre del producto", () => {
  render(
    <CartProvider>
      <FavoritesProvider>
        <ProductCard
          producto={{
            id: 1,
            nombre: "Zapatillas Urbanas",
            precio: 75,
            imagen: "",
            stock: 3,
          }}
        />
      </FavoritesProvider>
    </CartProvider>
  );
  expect(screen.getByText(/zapatillas urbanas/i)).toBeInTheDocument();
});
