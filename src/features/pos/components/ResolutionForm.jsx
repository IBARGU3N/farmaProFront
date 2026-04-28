import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ShortcutBadge } from '../../../components/ui/ShortcutBadge';

const ResolutionForm = ({ initialData, onSubmit, isLoading, onCancel }) => {
  const [formData, setFormData] = useState({
    prefix: initialData?.prefix || '',
    initial_number: initialData?.initial_number || '',
    final_number: initialData?.final_number || '',
    current_number: initialData?.current_number || '',
    resolution_date: initialData?.resolution_date ? new Date(initialData.resolution_date).toISOString().split('T')[0] : '',
    document_type: initialData?.document_type || '',
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-bold text-primary mb-4">
        {initialData ? 'Editar Resolución' : 'Nueva Resolución'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-primary mb-1">Tipo Documento</label>
          <select
            value={formData.document_type}
            onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
            className="w-full px-4 py-2 border border-primary-container/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          >
            <option value="">Seleccionar</option>
            <option value="Factura">Factura</option>
            <option value="POS">POS</option>
            <option value="NC">Nota de Crédito</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-primary mb-1">Prefijo</label>
          <input
            type="text"
            value={formData.prefix}
            onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
            className="w-full px-4 py-2 border border-primary-container/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Ej: FAC"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-primary mb-1">Fecha Resolución</label>
          <input
            type="date"
            value={formData.resolution_date}
            onChange={(e) => setFormData({ ...formData, resolution_date: e.target.value })}
            className="w-full px-4 py-2 border border-primary-container/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-primary mb-1">Número Inicial</label>
          <input
            type="number"
            value={formData.initial_number}
            onChange={(e) => setFormData({ ...formData, initial_number: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-primary-container/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-primary mb-1">Número Final</label>
          <input
            type="number"
            value={formData.final_number}
            onChange={(e) => setFormData({ ...formData, final_number: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-primary-container/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-primary mb-1">Número Actual</label>
          <input
            type="number"
            value={formData.current_number}
            onChange={(e) => setFormData({ ...formData, current_number: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-primary-container/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 rounded text-primary focus:ring-primary"
          />
          <label htmlFor="is_active" className="text-sm font-bold text-primary">Marcar como Activa</label>
        </div>
        <div className="md:col-span-2 flex gap-3">
          <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
            Guardar Resolución <ShortcutBadge keys="Ctrl+S" />
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ResolutionForm;
