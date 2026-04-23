import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { X, Save } from 'lucide-react';
import { ShortcutBadge } from '../../../components/ui/ShortcutBadge';

export const CajaForm = React.forwardRef(({ initialData, onSubmit, onCancel, isLoading, errors = {} }, ref) => {
  const [formData, setFormData] = useState({
    nombre: '',
    balance_inicial: 0,
    estado: 'CERRADA',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        balance_inicial: initialData.balance_inicial || 0,
        estado: initialData.estado || 'CERRADA',
      });
    } else {
      setFormData({
        nombre: '',
        balance_inicial: 0,
        estado: 'CERRADA',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance_inicial' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6 relative max-w-lg w-full mx-auto">
      <button 
        onClick={onCancel}
        className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
        title="Cerrar (Esc)"
      >
        <X size={24} />
      </button>

      <h2 className="text-xl font-black text-primary mb-6">
        {initialData?.id ? 'Editar Caja' : 'Nueva Caja'}
      </h2>

       <form ref={ref} onSubmit={handleSubmit} className="space-y-4">

        <div>
          <TextInput
            label="Nombre de la Caja"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Caja Principal Pasillo A"
            required
            autoFocus
            className={errors.nombre ? 'border-red-500' : ''}
            error={errors.nombre}
          />
        </div>

        <div>
          <TextInput
            label="Balance Inicial ($)"
            type="number"
            name="balance_inicial"
            value={formData.balance_inicial}
            onChange={handleChange}
            placeholder="0.00"
            required
            className={errors.balance_inicial ? 'border-red-500' : ''}
            error={errors.balance_inicial}
          />
        </div>

        <div>
          <TextInput
            label="Sucursal ID"
            name="sucursal_id"
            value={formData.sucursal_id}
            onChange={handleChange}
            placeholder="ID de la sucursal"
            required
            className={errors.sucursal_id ? 'border-red-500' : ''}
            error={errors.sucursal_id}
          />
        </div>

        <div>
          <TextInput
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            placeholder="Ej: ABIERTA, CERRADA"
            required
            className={errors.estado ? 'border-red-500' : ''}
            error={errors.estado}
          />
        </div>


        <div>
          <label className="block text-sm font-bold text-on-surface mb-1">Balance Inicial ($)</label>
          <TextInput
            type="number"
            name="balance_inicial"
            value={formData.balance_inicial}
            onChange={handleChange}
            placeholder="0.00"
            required
            className={errors.balance_inicial ? 'border-red-500' : ''}
          />
          {errors.balance_inicial && <p className="text-xs text-red-500 mt-1">{errors.balance_inicial}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-on-surface mb-1">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-secondary/30 rounded-lg bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            disabled={initialData?.id ? true : false}
          >
            <option value="CERRADA">Cerrada</option>
            <option value="ABIERTA">Abierta</option>
          </select>
          {errors.estado && <p className="text-xs text-red-500 mt-1">{errors.estado}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onCancel} type="button">
            Cancelar <ShortcutBadge keys="Esc" className="ml-2" />
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            <Save size={18} className="mr-2" />
            Guardar <ShortcutBadge keys="Ctrl+S" className="ml-2" />
          </Button>
        </div>
      </form>
    </Card>
  );
});
