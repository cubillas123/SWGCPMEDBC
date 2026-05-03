import React, { useState, useEffect } from 'react';
import { 
  FaUnlock, FaLock, FaShoppingCart, FaTruck, FaFileAlt, FaTag, FaCreditCard 
} from "react-icons/fa";
import "../../styles/pages/Cajero/AdmintrarCaja.css";
import Facturacion from './Facturacion';
import Cupon from './Cupon';
import Pago from './Pago';

const AdministrarCaja = () => {
  const [status, setStatus] = useState('CERRADA'); 
  const [showModalDir, setShowModalDir] = useState(false);
  const [notificacion, setNotificacion] = useState("");
  const [itemAPagar, setItemAPagar] = useState(null);
  const [pasoActual, setPasoActual] = useState(2); 
  const distritosPeru = ["Lima", "Miraflores", "San Isidro", "Comas", "Los Olivos", "Surco", "Ate", "Callao", "La Molina", "San Miguel"];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataString = params.get("data");
    if (dataString) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataString));
        setItemAPagar(decodedData[0]);
      } catch (e) {
        console.error("Error al decodificar datos", e);
      }
    }
  }, []);

  const toggleCaja = () => {
    setStatus(prev => prev === 'ABIERTA' ? 'CERRADA' : 'ABIERTA');
  };

  const guardarDireccion = (e) => {
    e.preventDefault();
    setNotificacion("¡Dirección guardada con éxito!");
    setTimeout(() => {
      setNotificacion("");
      setShowModalDir(false);
    }, 2000);
  };

  const totalCalculado = itemAPagar ? parseFloat(itemAPagar.venta.replace(/[^\d.-]/g, '')) : 0;
  const subtotal = totalCalculado / 1.18;
  const igv = totalCalculado - subtotal;
  const estaCerrada = status === 'CERRADA';

  const irSiguiente = () => { if (pasoActual < 5) setPasoActual(pasoActual + 1); };
  const irAtras = () => { if (pasoActual > 2) setPasoActual(pasoActual - 1); };

  // Mostrar el botón en el paso 1 y 2
const esPasoCarrito = pasoActual === 1 || pasoActual === 2;

  return (
    <div className="admin-caja-wrapper">
      {notificacion && <div className="notificacion-exito">{notificacion}</div>}

      <div className="checkout-stepper">
        <div className={`step ${pasoActual > 1 ? 'completed' : ''}`}><FaShoppingCart /><span>Carrito</span></div>
        <div className={`step ${pasoActual === 2 ? 'active' : pasoActual > 2 ? 'completed' : ''}`}><FaTruck /><span>Envío</span></div>
        <div className={`step ${pasoActual === 3 ? 'active' : pasoActual > 3 ? 'completed' : ''}`}><FaFileAlt /><span>Facturación</span></div>
        <div className={`step ${pasoActual === 4 ? 'active' : pasoActual > 4 ? 'completed' : ''}`}><FaTag /><span>Cupón</span></div>
        <div className={`step ${pasoActual === 5 ? 'active' : ''}`}><FaCreditCard /><span>Pago</span></div>
      </div>

      <div className="caja-main-layout">
        <div className="caja-left-panel">

          {/* ✅ Header: badge siempre visible, botón solo en paso Carrito */}
          <div className="caja-top-nav">
            <div className="caja-title-section">
              <h2>Administrar Caja</h2>
              <span className={`caja-badge ${status === 'ABIERTA' ? 'open' : 'closed'}`}>
                {status === 'ABIERTA' ? '● ABIERTA' : '● CERRADA'}
              </span>
            </div>

            {esPasoCarrito && (
              <button
                className={`caja-btn-toggle ${status === 'ABIERTA' ? 'btn-cerrar' : 'btn-abrir'}`}
                onClick={toggleCaja}
              >
                {estaCerrada ? <><FaUnlock /> ABRIR CAJA</> : <><FaLock /> CERRAR CAJA</>}
              </button>
            )}
          </div>

          <div className={`envio-section-box ${estaCerrada ? 'disabled-section' : ''}`}>
            
            {pasoActual === 2 && (
              <div className="fade-in">
                <h3>Detalles de Envío</h3>
                <div className="direccion-selector">
                  <button className="btn-agregar-dir" onClick={() => setShowModalDir(true)} disabled={estaCerrada}>
                    + AGREGAR DIRECCIÓN DE ENVÍO
                  </button>
                </div>
                <div className="horario-entrega">
                  <h4>Fecha de envío: 2026-12-11</h4>
                  <div className="radio-group">
                    <label><input type="radio" name="horario" defaultChecked disabled={estaCerrada} /> Mañana</label>
                    <label><input type="radio" name="horario" disabled={estaCerrada} /> Tarde</label>
                  </div>
                </div>
              </div>
            )}

            {pasoActual === 3 && <Facturacion />}
            {pasoActual === 4 && <Cupon />}
            {pasoActual === 5 && <Pago itemAPagar={itemAPagar} totalCalculado={totalCalculado} />}

          </div>
        </div>

        <div className="caja-right-panel">
          <div className="resumen-checkout-card">
            <h3>Resumen</h3>
            <div className="resumen-line"><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
            <div className="resumen-line"><span>IGV 18%</span><span>S/ {igv.toFixed(2)}</span></div>
            <div className="resumen-line total"><span>Total</span><span>S/ {totalCalculado.toFixed(2)}</span></div>
            
            <div className="resumen-actions">
              <button className="btn-atras" onClick={irAtras} disabled={pasoActual === 2}>ATRÁS</button>
              <button className="btn-siguiente" onClick={irSiguiente} disabled={estaCerrada}>
                {pasoActual === 5 ? "FINALIZAR" : "SIGUIENTE"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModalDir && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar dirección</h3>
            <form onSubmit={guardarDireccion}>
              <select required className="modal-input">
                <option value="">Distrito</option>
                {distritosPeru.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="text" placeholder="Dirección" required className="modal-input" />
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowModalDir(false)} className="btn-cancelar">CANCELAR</button>
                <button type="submit" className="btn-guardar">GUARDAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministrarCaja;