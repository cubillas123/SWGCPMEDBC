import React, { useState, useEffect } from 'react';
import "../../styles/pages/Cajero/Pago.css";
import qrYape from '../../assets/yape.png';

const QR_YAPE = qrYape; 

const Pago = ({ itemAPagar, totalCalculado }) => {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('tarjeta');
  const [pagoAprobado, setPagoAprobado] = useState(false);
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    vencimiento: '',
    cvv: '',
    nombre: '',
    cuotas: '1',
    email: '',
    terminos: false,
  });

  const handleTarjeta = (e) => {
    const { name, value, type, checked } = e.target;
    setTarjeta(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const formatNumero = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const confirmarPago = () => {
    // Guardar venta en localStorage para que el admin la vea
    if (itemAPagar) {
      const datosVenta = {
        id: Date.now(),
        producto: itemAPagar.producto || "Producto",
        venta: itemAPagar.venta || `S/ ${(totalCalculado || 0).toFixed(2)}`,
        cantidad: 1,
        total: totalCalculado || 0,
        metodoPago: metodoSeleccionado.charAt(0).toUpperCase() + metodoSeleccionado.slice(1),
        estado: "VALIDADO",
        fecha: new Date().toLocaleDateString(),
        imagen: itemAPagar.imagen || "https://via.placeholder.com/80x60?text=Producto"
      };

      const ventasRegistradas = JSON.parse(localStorage.getItem("ventas_registradas")) || [];
      ventasRegistradas.push(datosVenta);
      localStorage.setItem("ventas_registradas", JSON.stringify(ventasRegistradas));

      // Notificar a otros tabs
      window.dispatchEvent(new Event("ventaRegistrada"));
    }

    setPagoAprobado(true);
  };

  if (pagoAprobado) {
    const fechaVenta = new Date().toLocaleString();
    return (
      <div className="seccion-paso fade-in">
        <div className="pago-aprobado-card">
          <div className="pago-aprobado-icono">✓</div>
          <h2 className="pago-aprobado-titulo">¡Pago Aprobado!</h2>
          <p className="pago-aprobado-sub">
            Tu compra se ha procesado exitosamente.<br />
            Se ha enviado un comprobante a tu correo electrónico.
          </p>
          <div className="pago-aprobado-detalle">
            <h4>Detalles de la Compra</h4>
            <div className="pago-detalle-grid">
              <div><span className="pago-detalle-label">Fecha de venta</span><span>{fechaVenta}</span></div>
              <div><span className="pago-detalle-label">Tipo de venta</span><span>V001</span></div>
              <div><span className="pago-detalle-label">Tipo de Comprobante</span><span>Boleta</span></div>
              <div><span className="pago-detalle-label">N° de Comprobante</span><span>CV001</span></div>
              <div><span className="pago-detalle-label">Método de Pago</span><span>{metodoSeleccionado.toUpperCase()}</span></div>
            </div>
            <div className="pago-aprobado-total">S/ {(totalCalculado || 0).toFixed(2)}</div>
            <div className="pago-orden-aviso">
              📦 <strong>Orden de Compra</strong><br />
              <span>No se requiere orden de compra — Stock suficiente.</span>
            </div>
          </div>
          <button className="btn-continuar-comprando" onClick={() => { setPagoAprobado(false); setMetodoSeleccionado('tarjeta'); }}>
            CONTINUAR COMPRANDO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seccion-paso fade-in">
      <h3 className="pago-titulo">Pago con Mercado Pago</h3>

      <div className="pago-layout">
        {/* Panel izquierdo */}
        <div className="pago-card">
          <p className="pago-label">Medios de pago</p>

          {/* Tabs de métodos */}
          <div className="pago-tabs">
            <button
              className={`pago-tab ${metodoSeleccionado === 'tarjeta' ? 'active' : ''}`}
              onClick={() => setMetodoSeleccionado('tarjeta')}
            >
              💳 Tarjeta de crédito
            </button>
            <div className="pago-tab-iconos">
              <button
                className={`pago-tab-icono ${metodoSeleccionado === 'yape' ? 'active' : ''}`}
                onClick={() => setMetodoSeleccionado('yape')}
                title="Yape"
              >
                💜 Yape
              </button>
              <button
                className={`pago-tab-icono ${metodoSeleccionado === 'bcp' ? 'active' : ''}`}
                onClick={() => setMetodoSeleccionado('bcp')}
                title="BCP"
              >
                🏦 BCP
              </button>
              <button
                className={`pago-tab-icono ${metodoSeleccionado === 'bn' ? 'active' : ''}`}
                onClick={() => setMetodoSeleccionado('bn')}
                title="Banco de la Nación"
              >
                🏛️ BN
              </button>
            </div>
          </div>

          {/* YAPE → QR */}
          {metodoSeleccionado === 'yape' && (
            <div className="yape-qr-section fade-in">
              <p className="yape-instruccion">Escanea el QR con tu app de Yape para completar el pago.</p>
              <img src={QR_YAPE} alt="QR Yape" className="yape-qr-img" />  
              <p className="yape-numero">📱 Número Yape: <strong>999 888 777</strong></p>
              <button className="btn-pagar" onClick={confirmarPago}>Pagar</button>
            </div>
          )}

          {/* TARJETA / BCP / BN → Formulario */}
          {['tarjeta', 'bcp', 'bn'].includes(metodoSeleccionado) && (
            <div className="tarjeta-form fade-in">
              {metodoSeleccionado !== 'tarjeta' && (
                <p className="pago-banco-info">
                  {metodoSeleccionado === 'bcp' ? '🏦 BCP — ' : '🏛️ Banco de la Nación — '}
                  Ingresa los datos de tu tarjeta débito/crédito
                </p>
              )}

              {/* Número de tarjeta */}
              <div className="form-group-pago">
                <label className="pago-input-label">Número de la tarjeta</label>
                <input
                  name="numero"
                  value={formatNumero(tarjeta.numero)}
                  onChange={(e) => setTarjeta(prev => ({ ...prev, numero: e.target.value.replace(/\s/g, '') }))}
                  placeholder="1234 1234 1234 1234"
                  className="modal-input"
                  maxLength={19}
                />
              </div>

              {/* Vencimiento + CVV */}
              <div className="pago-row-2">
                <div className="form-group-pago">
                  <label className="pago-input-label">Vencimiento</label>
                  <input
                    name="vencimiento"
                    value={tarjeta.vencimiento}
                    onChange={handleTarjeta}
                    placeholder="MM/AA"
                    className="modal-input"
                    maxLength={5}
                  />
                </div>
                <div className="form-group-pago">
                  <label className="pago-input-label">Código de seguridad</label>
                  <div className="cvv-wrapper">
                    <input
                      name="cvv"
                      value={tarjeta.cvv}
                      onChange={handleTarjeta}
                      placeholder="S/ 0.0"
                      className="modal-input"
                      maxLength={4}
                    />
                    <span className="cvv-icono">🛡️</span>
                  </div>
                </div>
              </div>

              {/* Nombre */}
              <div className="form-group-pago">
                <label className="pago-input-label">Nombre como aparece en la tarjeta</label>
                <input
                  name="nombre"
                  value={tarjeta.nombre}
                  onChange={handleTarjeta}
                  placeholder="Titular"
                  className="modal-input"
                />
              </div>

              {/* Cuotas */}
              <div className="form-group-pago">
                <label className="pago-input-label">Cuotas</label>
                <select name="cuotas" value={tarjeta.cuotas} onChange={handleTarjeta} className="modal-input">
                  <option value="1">1 cuota</option>
                  <option value="3">3 cuotas</option>
                  <option value="6">6 cuotas</option>
                  <option value="12">12 cuotas</option>
                </select>
              </div>

              {/* Separador */}
              <p className="pago-seccion-sub">Completa la información</p>

              {/* Email */}
              <div className="form-group-pago">
                <label className="pago-input-label">Email</label>
                <input
                  name="email"
                  value={tarjeta.email}
                  onChange={handleTarjeta}
                  placeholder="ejemplo@mail.com"
                  type="email"
                  className="modal-input"
                />
              </div>

              {/* Términos */}
              <label className="pago-terminos">
                <input
                  type="checkbox"
                  name="terminos"
                  checked={tarjeta.terminos}
                  onChange={handleTarjeta}
                />
                <span>Términos y condiciones</span>
              </label>

              <button
                className="btn-pagar"
                onClick={confirmarPago}
                disabled={!tarjeta.terminos}
              >
                Pagar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pago;