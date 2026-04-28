import React from 'react';

export default function PrintStatusPopup({ open, status, message, onClose }) {
  if (!open) return null;
  const title = status === 'success' ? 'Impresión completada' : status === 'error' ? 'Error de impresión' : 'Imprimiendo...';
  return (
    <div className="modal-overlay" role="dialog" aria-label="Print status">
      <div className="modal" style={{ padding: 20, background: '#fff', borderRadius: 8, width: 420 }}>
        <h4 style={{ marginTop: 0 }}>{title}</h4>
        <p>{message}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
