// src/components/Checkout.jsx
import React, { useState } from 'react';
import { useCart } from "../context/CartContext";
import { Link } from 'react-router-dom';
import { FaTruck, FaStore } from 'react-icons/fa'; 

// --- Datos Fijos de Sucursales (Simulación) ---
const SUCURSALES = [
    { id: 1, nombre: "Sucursal Centro", direccion: "Calle Falsa 123, Buenos Aires" },
    { id: 2, nombre: "Sucursal Norte", direccion: "Av. Libertador 456, CABA" },
    { id: 3, nombre: "Sucursal Sur", direccion: "Rivadavia 789, Quilmes" },
];
// ... (Todo el código del componente Checkout que te proporcioné antes, con los 4 pasos)
// 
const Checkout = () => {
    const { cartItems, totalPrice, totalItems, clearCart } = useCart();
    const [step, setStep] = useState(1); 
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [delivery, setDelivery] = useState({
        method: '', // 'domicilio' o 'sucursal'
        address: '',
        city: '',
        selectedBranchId: null,
    });
    const [paymentMethod, setPaymentMethod] = useState('creditCard');

    // ... (Lógica de carrito vacío y handlePlaceOrder)

    // ... (Implementación de Step1_MethodSelection, Step2_Details, Step3_Payment, Step4_Confirmation)

    // ... (renderStep y cálculo de totales)

    const shippingCost = delivery.method === 'domicilio' ? 500 : 0;
    const finalTotal = (parseFloat(totalPrice) + shippingCost).toFixed(2);


    return (
        <div className="container mt-5">
             <h2 className="mb-4">Finalizar Compra - Paso {step} de 3</h2> 
             <div className="row">
                <div className="col-md-7 mb-4">
                    <div className="card p-4">
                       {/* 🟢 Renderiza el paso actual */}
                       {/* Se asume que has copiado las funciones Step1, Step2, Step3, Step4 */}
                       {/* Aquí iría la función renderStep() */}
                    </div>
                </div>

                {/* Columna de Resumen */}
                <div className="col-md-5">
                  <div className="summary-card sticky-top">
                    <h4 className="mb-3">Resumen del Pedido</h4>
                    {/* ... (Mapeo de cartItems y cálculo de subtotales) */}
                    <ul className="summary-details">
                      <li><span>Subtotal ({totalItems} Productos)</span><span>${totalPrice}</span></li>
                      <li><span>Gastos de Envío</span><span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Gratis'}</span></li>
                      <li className="summary-total"><span>TOTAL A PAGAR</span><span>${finalTotal}</span></li>
                    </ul>
                    {/* ... (Detalles de la Entrega elegida) */}
                  </div>
                </div>
             </div>
        </div>
    );
}

export default Checkout;