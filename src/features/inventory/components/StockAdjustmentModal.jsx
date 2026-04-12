import { useState } from 'react';
import { useAdjustStock } from '../hooks/useInventory';
import toast from 'react-hot-toast';

export const StockAdjustmentModal = ({ isOpen, onClose, lot }) => {
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [errors, setErrors] = useState({});

  const adjustMutation = useAdjustStock();

  if (!isOpen || !lot) return null;

  const validate = () => {
    const newErrors = {};
    if (!cantidad || isNaN(parseInt(cantidad))) newErrors.cantidad = 'Ingrese una cantidad valida';
    if (!motivo.trim()) newErrors.motivo = 'El motivo es obligatorio';
    if (parseInt(cantidad) < 0 && Math.abs(parseInt(cantidad)) > lot.cantidad) {
      newErrors.cantidad = `No puede retirar mas de ${lot.cantidad} unidades`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    adjustMutation.mutate(
      {
        inventario_lote_id: lot.id,
        cantidad: parseInt(cantidad),
        motivo: motivo,
      },
      {
        onSuccess: () => {
          toast.success('Stock ajustado exitosamente');
          onClose();
          setCantidad('');
          setMotivo('');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Error al ajustar stock'),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#9BF3F0]/30 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-[#9BF3F0]/20">
          <h3 className="text-xl font-black text-[#473198]">Ajustar Stock</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#DAFFED]/50 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-[#473198]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="bg-[#DAFFED]/30 rounded-xl p-4 mb-4">
            <p className="text-sm text-[#473198]/60">Stock actual</p>
            <p className="text-2xl font-black text-[#473198]">{lot.cantidad} unidades</p>
            <p className="text-xs text-[#473198]/40 mt-1">Lote: {lot.lote}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Cantidad (+/-)</label>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Ej: 50 para agregar, -10 para retirar"
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20 ${errors.cantidad ? 'border-red-400' : 'border-[#9BF3F0]/30'}`}
              />
              {errors.cantidad && <p className="text-xs text-red-500 mt-1">{errors.cantidad}</p>}
              <p className="text-xs text-[#473198]/40 mt-1">Valores positivos agregan, negativos retiran</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Motivo *</label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: Ajuste por inventario fisico, mercancia danada, etc."
                rows={3}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20 resize-none ${errors.motivo ? 'border-red-400' : 'border-[#9BF3F0]/30'}`}
              />
              {errors.motivo && <p className="text-xs text-red-500 mt-1">{errors.motivo}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border-2 border-[#9BF3F0]/30 text-[#473198] rounded-xl font-bold hover:bg-[#9BF3F0]/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={adjustMutation.isLoading}
                className="flex-1 px-4 py-2 bg-[#473198] text-white rounded-xl font-bold hover:bg-[#4A0D67] transition-colors disabled:opacity-50"
              >
                {adjustMutation.isLoading ? 'Ajustando...' : 'Ajustar Stock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
