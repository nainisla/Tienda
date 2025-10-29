import React from "react";

const Tienda = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center text-dark mb-4">Tienda Adidrive</h1>

      <div className="row">
        {/* Producto 1 */}
        <div className="col-md-4">
          <div className="card shadow-sm p-3 mb-4">
            <img
              src="https://via.placeholder.com/300x200"
              className="card-img-top"
              alt="Zapatilla Drip"
            />
            <div className="card-body text-center">
              <h5 className="card-title">Zapatilla Drip</h5>
              <p className="card-text">$25.000</p>
              <button className="btn btn-dark w-100">Agregar al carrito</button>
            </div>
          </div>
        </div>

        {/* Podés copiar este bloque y cambiar los datos para más productos */}
      </div>
    </div>
  );
};

export default Tienda;
