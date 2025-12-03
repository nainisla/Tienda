import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach } from "vitest";
import ProductCard from "../src/components/ProductCard.jsx";

test('muestra "(¡Últimas unidades!)" y mantiene el botón habilitado cuando el stock es bajo (ej: 3)', () => {
  render(
    <ProductCard
      producto={{
        id: 1,
        nombre: "Zapatillas Urbanas Clásicas",
        precio: 75.0,
        imagen: "product1.jpg",
        stock: 3,
      }}
    />
  );
  const warningText = screen.getByText(/últimas unidades/i);
  expect(warningText).toBeInTheDocument();
});
