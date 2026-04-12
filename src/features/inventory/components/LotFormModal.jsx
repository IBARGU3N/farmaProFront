import { useState } from 'react';

export const LotFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, productId }) => {
  const [form, setForm] = useState({
    producto_id: productId || '',
    lote: '',
    fecha_vencimiento: '',
    cantidad: '',
    ubicacion: '',
    precio_compra: '',
    precio_venta: '',
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.lote.trim()) newErrors.lote = 'El lote es obligatorio';
    if (!form.fecha_vencimiento) newErrors.fecha_vencimiento = 'La fecha de vencimiento es obligatoria';
    if (!form.cantidad || parseInt(form.cantidad) < 0) newErrors.cantidad = 'La cantidad debe ser mayor o igual a 0';
    if (!form.precio_venta || parseFloat(form.precio_venta) <= 0) newErrors.precio_venta = 'El precio de venta debe ser mayor a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      producto_id: productId || form.producto_id,
      cantidad: parseInt(form.cantidad),
      precio_compra: form.precio_compra ? parseFloat(form.precio_compra) : null,
      precio_venta: parseFloat(form.precio_venta),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#9BF3F0]/30 w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-[#9BF3F0]/20">
          <h3 className="text-xl font-black text-[#473198]">
            {initialData ? 'Editar Lote' : 'Nuevo Lote'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-[#DAFFED]/50 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-[#473198]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Lote *</label>
              <input
                type="text"
                value={form.lote}
                onChange={(e) => setForm({ ...form, lote: e.target.value })}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20 ${errors.lote ? 'border-red-400' : 'border-[#9BF3F0]/30'}`}
              />
              {errors.lote && <p className="text-xs text-red-500 mt-1">{errors.lote}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Fecha Vencimiento *</label>
              <input
                type="date"
                value={form.fecha_vencimiento}
                onChange={(e) => setForm({ ...form, fecha_vencimiento: e.target.value })}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20 ${errors.fecha_vencimiento ? 'border-red-400' : 'border-[#9BF3F0]/30'}`}
              />
              {errors.fecha_vencimiento && <p className="text-xs text-red-500 mt-1">{errors.fecha_vencimiento}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Cantidad *</label>
              <input
                type="number"
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20 ${errors.cantidad ? 'border-red-400' : 'border-[#9BF3F0]/30'}`}
                min="0"
              />
              {errors.cantidad && <p className="text-xs text-red-500 mt-1">{errors.cantidad}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Ubicacion</label>
              <input
                type="text"
                value={form.ubicacion}
                onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Precio Compra</label>
              <input
                type="number"
                value={form.precio_compra}
                onChange={(e) => setForm({ ...form, precio_compra: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Precio Venta *</label>
              <input
                type="number"
                value={form.precio_venta}
                onChange={(e) => setForm({ ...form, precio_venta: e.target.value })}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20 ${errors.precio_venta ? 'border-red-400' : 'border-[#9BF3F0]/30'}`}
                min="0"
                step="0.01"
              />
              {errors.precio_venta && <p className="text-xs text-red-500 mt-1">{errors.precio_venta}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-[#9BF3F0]/30 text-[#473198] rounded-xl font-bold hover:bg-[#9BF3F0]/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#473198] text-white rounded-xl font-bold hover:bg-[#4A0D67] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Lote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
