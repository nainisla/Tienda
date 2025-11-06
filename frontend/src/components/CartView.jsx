import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa"; 

const API_BASE_URL = "https://localhost:5000";

const CartView = () => {
  // ✅ CLAVE: Destructuramos la función updateQuantity que viene del contexto
  const { cartItems, removeFromCart, totalPrice, totalItems, updateQuantity, clearCart } = useCart();
  
  // ❌ IMPORTANTE: Eliminamos la declaración local de 'updateQuantity' y los 'handleIncrease/handleDecrease' 
  // para evitar la duplicidad y usar directamente la lógica del Contexto.
  
  if (cartItems.length === 0) {
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
        {/* Columna de Productos (8/12 - Mantiene el ancho, pero el diseño interno cambiará con CSS) */}
        <div className="col-md-8">
          
          {/* Botón de Vaciar Carrito (Visible arriba de los ítems) */}
          <div className="d-flex justify-content-end mb-3">
             <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
                 Vaciar Carrito
             </button>
          </div>
          
          {cartItems.map((item) => (
            // ✅ Clase personalizada para estilizar la tarjeta de ítem
            <div key={item.id} className="card mb-3 cart-item-card-lumine"> 
              <div className="card-body d-flex align-items-start p-3">
                
                {/* 1. Imagen */}
                <img 
                    src={`${API_BASE_URL}/static/${item.imagen}`} 
                    alt={item.nombre} 
                    className="item-image me-3" 
                    // Establecer un ancho fijo para que la información quede centrada
                    style={{ width: '80px', height: '100px', objectFit: 'cover' }} 
                  />
                
                {/* 2. Info (Nombre, Talla, Color - flex-grow-1 para ocupar el espacio) */}
                <div className="flex-grow-1">
                  <h5 className="card-title mb-1 fw-bold">{item.nombre}</h5>
                  <p className="mb-1 text-muted small">
                    Color: CLOUD WHITE / CLEAR PINK
                  </p>
                  <p className="mb-3 text-muted small">TAMAÑO: 37.5 (UK 5.5)</p>
                  <p className="mb-1 fw-bold text-dark d-block d-md-none">
                    Total: ${(item.precio * item.cantidad).toFixed(2)}
                  </p>
                </div>

                {/* 3. Controles de Cantidad y Precio (Columna derecha) */}
                <div className="text-end d-flex flex-column align-items-end justify-content-start ms-4">
                  
                  {/* Precio total por item (Oculto en móvil, visible en escritorio) */}
                  <h5 className="mb-2 fw-bold text-dark d-none d-md-block"> 
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </h5>

                  {/* ✅ CLAVE: Controles de Cantidad con clase personalizada */}
                  <div className="quantity-controls-lumine my-2 d-flex align-items-center">
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="quantity-display">{item.cantidad}</span> 
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>

                  {/* Botón de Quitar */}
                  <button
                    className="remove-button-lumine mt-1 text-muted" // Clase personalizada para el icono
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Columna de Resumen (4/12 - Mantiene la estructura) */}
        <div className="col-md-4">
          <div className="summary-card sticky-top">
            <h4 className="mb-3">Resumen del Pedido</h4>
            {/* ... (Resto del resumen) ... */}
            <ul className="summary-details">
              <li>
                <span>{totalItems} Productos</span>
                <span>${totalPrice}</span>
              </li>
              <li>
                <span>Gastos de Envío</span>
                <span>Gratis</span> 
              </li>
              <li className="summary-total">
                <span>TOTAL</span>
                <span>${totalPrice}</span>
              </li>
            </ul>
            <p className="small mt-4">
              IVA incluido ${((parseFloat(totalPrice) * 0.21) / 1.21).toFixed(2)}{" "}
            </p>{" "}
            <Link
              to="/checkout"
              className="checkout-button w-100 mt-3 btn btn-dark py-2"
              style={{
                pointerEvents: cartItems.length === 0 ? "none" : "auto",
                opacity: cartItems.length === 0 ? 0.6 : 1,
              }}
            >
              FINALIZAR COMPRA
            </Link>
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