import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Carrito.css";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(data);
  }, []);

  const irAPagar = () => {
    if (carrito.length === 0) return;

    // Calcular total
    const total = carrito.reduce((acc, item) => acc + item.precio, 0);

    // Crear datos de la venta para pasar a la página de pago
    const datosVenta = carrito.map(item => ({
      producto: item.nombre,
      imagen: item.imagen, 
      venta: `S/ ${item.precio.toFixed(2)}`,
      estado: "PENDIENTE"
    }));

    // Pasar datos a la página de pago en Admin
    const datosVentaString = encodeURIComponent(JSON.stringify(datosVenta));
    
    // Guardar en sessionStorage para que el componente Pago lo use
    sessionStorage.setItem("datosCarrito", JSON.stringify({
      productos: carrito,
      total: total
    }));
    
    localStorage.removeItem("carrito");
    window.location.href = `http://localhost:3000/admin/caja/administrar?data=${datosVentaString}`;
  };

  const irAProductos = () => {
    window.location.href = `http://localhost:3000/admin/producto/gestionar`;
  };

  const eliminarProducto = (index) => {
    const nuevo = carrito.filter((_, i) => i !== index);
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <>
      <Navbar />
      <div className="carrito-container">
        <h1>Tu Carrito</h1>
        <div className="carrito-lista">
          {carrito.length === 0 ? (
            <p className="carrito-vacio">El carrito está vacío</p>
          ) : (
            carrito.map((item, index) => (
              <div className="carrito-item" key={index}>
                <img src={item.imagen} alt={item.nombre} className="img-cart" />
                <div className="carrito-info">
                  <h4>{item.nombre}</h4>
                  <p className="item-precio">S/ {item.precio.toFixed(2)}</p>
                </div>
                <button className="btn-eliminar" onClick={() => eliminarProducto(index)}>
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        <div className="carrito-footer">
          <div className="subtotal-container">
            <span>Subtotal</span>
            <span className="subtotal-monto">S/. {total.toFixed(2)}</span>
          </div>
          
          <div className="acciones-carrito">
            <button className="btn-azul" onClick={irAPagar}>
              VER DETALLE Y PAGAR
            </button>
            <button className="btn-azul" onClick={irAProductos}>
              BUSCAR MÁS PRODUCTOS
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Carrito;