// CartView.jsx (Modificado)
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa"; // ⬅️ Íconos necesarios

const CartView = () => {
  // Necesitarás una función para cambiar la cantidad en CartContext (si aún no la tienes)
  // Asumiré que existe updateQuantity para el ejemplo.
  // Si no existe, reemplaza con funciones dummy o añade la lógica en CartContext.jsx
  const { cartItems, removeFromCart, totalPrice, totalItems } = useCart();

  // --- Funciones para aumentar/disminuir la cantidad (DUMMY/EJEMPLO) ---
  // ⚠️ REQUiere implementar esta lógica en CartContext.jsx ⚠️
  const updateQuantity = (id, newQuantity) => {
    console.log(`Actualizar producto ${id} a cantidad ${newQuantity}`);
    // Aquí iría la llamada a una función dentro de useCart
    // Ejemplo: context.updateItemQuantity(id, newQuantity);
  };

  if (cartItems.length === 0) {
    // ... (Vista de carrito vacío se mantiene igual)
    return (
      <div className="container mt-5 text-center">
        <h2 className="mb-4">🛍️ Tu Carrito está Vacío</h2>
        <p>Parece que aún no has añadido productos. ¡Explora nuestra tienda!</p>
        <Link to="/" className="btn btn-dark mt-3">
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        Mi Carrito de Compras ({totalItems}{" "}
        {totalItems === 1 ? "Artículo" : "Artículos"})
      </h2>

      <div className="row">
        {/* Columna de Productos (8/12) */}
        <div className="col-md-8">
          {cartItems.map((item) => (
            <div key={item.id} className="card mb-3 cart-item-card">
              <div className="card-body d-flex align-items-start p-3">
                {/* Columna 1: Imagen y Detalles */}
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="cart-item-image"
                />

                {/* Columna 2: Info (Nombre, Talla, Color - simulado) */}
                <div className="flex-grow-1">
                  <h5 className="card-title mb-1">{item.nombre}</h5>
                  {/* Simulamos la información detallada de talla/color */}
                  <p className="mb-1 text-muted small">
                    Color: CLOUD WHITE / CLEAR PINK
                  </p>
                  <p className="mb-3 text-muted small">TAMAÑO: 37.5 (UK 5.5)</p>
                  <p className="mb-1 fw-bold">
                    Precio Unitario: ${item.precio.toFixed(2)}
                  </p>
                </div>

                {/* Columna 3: Controles de Cantidad y Precio */}
                <div className="text-end d-flex flex-column align-items-end">
                  {/* Precio total por item */}
                  <h5 className="mb-2 fw-bold">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </h5>

                  {/* Controles de Cantidad */}
                  <div className="quantity-controls my-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      <FaMinus size={12} />
                    </button>
                    <input type="number" readOnly value={item.cantidad} />
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>

                  {/* Botón de Quitar */}
                  <button
                    className="remove-button mt-1"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrashAlt size={16} /> {/* Ícono de papelera */}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Botón de Vaciar Carrito (si aplica) */}
          {/* <button className="btn btn-outline-secondary mt-3" onClick={clearCart}>
                        Vaciar Carrito
                    </button> */}
        </div>

        {/* Columna de Resumen (4/12) */}
        <div className="col-md-4">
          <div className="summary-card sticky-top">
            <h4 className="mb-3">Resumen del Pedido</h4>
            <ul className="summary-details">
              <li>
                <span>{totalItems} Productos</span>
                <span>${totalPrice}</span>
              </li>
              <li>
                <span>Gastos de Envío</span>
                <span>Gratis</span> {/* Simulación */}
              </li>
              <li className="summary-total">
                <span>TOTAL</span>
                <span>${totalPrice}</span>
              </li>
            </ul>
            <p className="small mt-4">
              IVA incluido ${((totalPrice * 0.21) / 1.21).toFixed(2)}{" "}
            </p>{" "}
            {/* Simulación de IVA 21% */}
            <button className="checkout-button w-100 mt-3">
              FINALIZAR COMPRA
            </button>
            <hr className="my-4" />
            <p className="text-center small">
              Compra en **6 CUOTAS SIN INTERÉS** si superas los $149.999.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
