import React, { useEffect, useState } from 'react';
import PrinterList from './printers/PrinterList';
import PrintStatusPopup from './modals/PrintStatusPopup';

// Smart component: handles state and business logic for printers
export default function PrinterSettings() {
  const [printers, setPrinters] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ open: false, status: '', message: '' });
  const [orgId] = useState(() => {
    const v = localStorage.getItem('orgId') || '1';
    return parseInt(v, 10);
  });
  const [newPrinter, setNewPrinter] = useState({ name: '', type: 'local', location: '' });
  const [editing, setEditing] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', type: 'local', location: '' });

  useEffect(() => {
    fetchPrinters();
  }, []);

  async function fetchPrinters() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/printers', {
        headers: { 'X-Org-Id': String(orgId) },
      });
      if (!res.ok) throw new Error('Failed to fetch printers');
      const data = await res.json();
      setPrinters(data);
      if (data.length > 0) setSelectedId(data[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function createPrinter() {
    if (!newPrinter.name) return;
    try {
      const res = await fetch('/api/v1/printers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Org-Id': String(orgId),
        },
        body: JSON.stringify({ name: newPrinter.name, type: newPrinter.type, location: newPrinter.location }),
      });
      if (res.ok) {
        setNewPrinter({ name: '', type: 'local', location: '' });
        fetchPrinters();
      } else {
        const err = await res.json().catch(() => ({}));
        setPopup({ open: true, status: 'error', message: err.message || 'Error creando impresora' });
      }
    } catch (e) {
      setPopup({ open: true, status: 'error', message: 'Error de red' });
    }
  }

  async function deletePrinter(printerId) {
    if (!orgId) return;
    try {
      const res = await fetch(`/api/v1/printers/${printerId}`, {
        method: 'DELETE',
        headers: { 'X-Org-Id': String(orgId) },
      });
      if (res.ok) {
        fetchPrinters();
      } else {
        setPopup({ open: true, status: 'error', message: 'No se pudo eliminar la impresora' });
      }
    } catch (e) {
      setPopup({ open: true, status: 'error', message: 'Error de red' });
    }
  }

  async function saveEditing(printerId) {
    try {
      const res = await fetch(`/api/v1/printers/${printerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Org-Id': String(orgId),
        },
        body: JSON.stringify({ name: editingData.name, type: editingData.type, location: editingData.location }),
      });
      if (res.ok) {
        setEditing(null);
        fetchPrinters();
      } else {
        setPopup({ open: true, status: 'error', message: 'No se pudo actualizar la impresora' });
      }
    } catch (e) {
      setPopup({ open: true, status: 'error', message: 'Error de red' });
    }
  }

  async function printSampleTicket() {
    if (!selectedId) return;
    setPopup({ open: true, status: 'pending', message: 'Imprimiendo ticket de prueba...' });
    try {
      const res = await fetch('/api/v1/print-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: 'TEST-ORDER-001', printer_id: selectedId }),
      });
      if (res.ok) {
        setPopup({ open: true, status: 'success', message: 'Impresión de prueba exitosa' });
      } else {
        const err = await res.json().catch(() => ({}));
        setPopup({ open: true, status: 'error', message: err.message || 'Error de impresión' });
      }
    } catch (e) {
      setPopup({ open: true, status: 'error', message: 'Error de red' });
    }
  }

  return (
    <section className="bg-white rounded-xl shadow p-4 md:p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Impresoras</h2>
          <p className="text-sm text-gray-600">Gestiona impresoras locales y de red asociadas a la organización</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">Module</span>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <PrinterList printers={printers} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="text-sm text-gray-500">Selecciona una impresora para realizar pruebas o editar.</div>
        </div>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-2">Nueva impresora</h4>
            <div className="flex items-center gap-3">
              <input
                placeholder="Nombre"
                value={newPrinter.name}
                onChange={(e) => setNewPrinter((p) => ({ ...p, name: e.target.value }))}
                className="px-3 py-2 border rounded-md w-40"
              />
              <select
                value={newPrinter.type}
                onChange={(e) => setNewPrinter((p) => ({ ...p, type: e.target.value }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="local">Local</option>
                <option value="network">Network</option>
              </select>
              <input
                placeholder="Ubicación (opcional)"
                value={newPrinter.location}
                onChange={(e) => setNewPrinter((p) => ({ ...p, location: e.target.value }))}
                className="px-3 py-2 border rounded-md"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={createPrinter}>Crear</button>
            </div>
          </div>
          <PrintStatusPopup
            open={popup.open}
            status={popup.status}
            message={popup.message}
            onClose={() => setPopup({ open: false, status: '', message: '' })}
          />
          {printers.length > 0 && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-2">Editar / Eliminar</h4>
              {printers.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-1 border-b last:border-0">
                  {editing === p.id ? (
                    <>
                      <input value={editingData.name} onChange={(e) => setEditingData((d) => ({ ...d, name: e.target.value }))} className="border rounded px-2 py-1" />
                      <select
                        value={editingData.type}
                        onChange={(e) => setEditingData((d) => ({ ...d, type: e.target.value }))}
                        className="border rounded px-2 py-1"
                      >
                        <option value="local">Local</option>
                        <option value="network">Network</option>
                      </select>
                      <input value={editingData.location} onChange={(e) => setEditingData((d) => ({ ...d, location: e.target.value }))} className="border rounded px-2 py-1" />
                      <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => saveEditing(p.id)}>Guardar</button>
                      <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => setEditing(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <span className="mr-4" style={{ minWidth: 150 }}>{p.name}</span>
                      <span className="text-sm text-gray-600 mr-4">{p.type}</span>
                      <span className="text-sm text-gray-600 mr-4">{p.location}</span>
                      <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => { setEditing(p.id); setEditingData({ name: p.name, type: p.type, location: p.location }); }}>Editar</button>
                      <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => deletePrinter(p.id)}>Eliminar</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
