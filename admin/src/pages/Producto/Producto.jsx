import React, { useState, useEffect } from "react";
import { FaTrash, FaFilePdf, FaSearch, FaBoxOpen } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/pages/Producto/Producto.css"; 

const Producto = () => {
  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarVentas();
    window.addEventListener("storage", cargarVentas);
    window.addEventListener("ventaRegistrada", cargarVentas);
    return () => {
      window.removeEventListener("storage", cargarVentas);
      window.removeEventListener("ventaRegistrada", cargarVentas);
    };
  }, []);

  const cargarVentas = () => {
    const ventasGuardadas = JSON.parse(localStorage.getItem("ventas_registradas")) || [];
    setVentas(ventasGuardadas);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Gestión de Productos", 14, 15);
    
    const tablaData = ventas.map((v, i) => [
      i + 1, 
      v.producto || "Sin nombre", 
      v.venta || "S/ 0.00", 
      v.estado || "PENDIENTE",
      v.fecha || ""
    ]);

    autoTable(doc, {
      head: [['#', 'Producto', 'Total', 'Estado', 'Fecha']],
      body: tablaData,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [39, 174, 96] }
    });

    doc.save("reporte-ventas.pdf");
  };

  const eliminarVenta = (id) => {
    const nuevaLista = ventas.filter((v) => v.id !== id);
    setVentas(nuevaLista);
  };

  return (
    <div className="admin-producto-page">
      <header className="table-header-container">
        <div className="header-text">
          <h1><FaBoxOpen /> Gestión de Productos</h1>
          <p>Ventas registradas desde el carrito del cliente</p>
        </div>
        <button className="btn-export-pdf" onClick={exportarPDF}>
          <FaFilePdf /> Exportar PDF
        </button>
      </header>

      <div className="search-section-center">
        <div className="search-bar-modern">
          <FaSearch color="#999" />
          <input 
            type="text" 
            placeholder="Buscar producto..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} 
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>PRODUCTO</th>
              <th>IMAGEN</th>
              <th>TOTAL</th>
              <th>MÉTODO PAGO</th>
              <th>ESTADO</th>
              <th>FECHA</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length > 0 ? (
              ventas
                .filter(v => (v.producto || "").toLowerCase().includes(busqueda.toLowerCase()))
                .map((v, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td className="prod-name">{v.producto}</td>
                  <td>
                    <div className="container-img-tabla">
                      <img 
                        src={v.imagen} 
                        alt={v.producto} 
                        className="img-tabla" 
                        onError={(e) => { e.target.src = "https://via.placeholder.com/80x60?text=Producto"; }}
                      />
                    </div>
                  </td>
                  <td className="prod-price">{v.venta}</td>
                  <td>{v.metodoPago || "No especificado"}</td>
                  <td><span className="badge-status">{v.estado}</span></td>
                  <td>{v.fecha || new Date().toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => eliminarVenta(i)} className="btn-delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">No hay compras registradas. Los clientes deben completar el pago en el carrito.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Producto;