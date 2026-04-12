import { useState, useEffect } from 'react';

export const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, laboratories = [] }) => {
  const [form, setForm] = useState({
    nombre: '',
    codigo_barras: '',
    laboratorio_id: '',
    categoria: '',
    registro_invima: '',
    presentacion: '',
    porcentaje_impuesto: '0',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre || '',
        codigo_barras: initialData.codigo_barras || '',
        laboratorio_id: initialData.laboratorio_id || '',
        categoria: initialData.categoria || '',
        registro_invima: initialData.registro_invima || '',
        presentacion: initialData.presentacion || '',
        porcentaje_impuesto: initialData.porcentaje_impuesto || '0',
      });
    } else {
      setForm({
        nombre: '',
        codigo_barras: '',
        laboratorio_id: '',
        categoria: '',
        registro_invima: '',
        presentacion: '',
        porcentaje_impuesto: '0',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (form.porcentaje_impuesto && (isNaN(form.porcentaje_impuesto) || form.porcentaje_impuesto < 0 || form.porcentaje_impuesto > 100)) {
      newErrors.porcentaje_impuesto = 'Debe ser un valor entre 0 y 100';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#9BF3F0]/30 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#9BF3F0]/20">
          <h3 className="text-xl font-black text-[#473198]">
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-[#DAFFED]/50 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-[#473198]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#473198] mb-1">Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20 ${errors.nombre ? 'border-red-400' : 'border-[#9BF3F0]/30'}`}
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Codigo de Barras</label>
              <input
                type="text"
                value={form.codigo_barras}
                onChange={(e) => setForm({ ...form, codigo_barras: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Categoria</label>
              <input
                type="text"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#473198] mb-1">Laboratorio</label>
            <select
              value={form.laboratorio_id}
              onChange={(e) => setForm({ ...form, laboratorio_id: e.target.value })}
              className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
            >
              <option value="">Seleccionar laboratorio</option>
              {laboratories?.map((lab) => (
                <option key={lab.id} value={lab.id}>{lab.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Registro INVIMA</label>
              <input
                type="text"
                value={form.registro_invima}
                onChange={(e) => setForm({ ...form, registro_invima: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Presentacion</label>
              <input
                type="text"
                value={form.presentacion}
                onChange={(e) => setForm({ ...form, presentacion: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#473198] mb-1">Porcentaje Impuesto (%)</label>
            <input
              type="number"
              value={form.porcentaje_impuesto}
              onChange={(e) => setForm({ ...form, porcentaje_impuesto: e.target.value })}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20 ${errors.porcentaje_impuesto ? 'border-red-400' : 'border-[#9BF3F0]/30'}`}
              min="0"
              max="100"
              step="0.01"
            />
            {errors.porcentaje_impuesto && <p className="text-xs text-red-500 mt-1">{errors.porcentaje_impuesto}</p>}
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
              {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
