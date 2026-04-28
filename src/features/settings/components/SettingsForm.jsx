import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { TextInput } from '../../../components/ui/TextInput';
import { TextArea } from '../../../components/ui/TextArea';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { TicketPreview } from './ui/TicketPreview';

export const SettingsForm = ({ initialSettings, onSave, isSaving }) => {
  const [formData, setFormData] = useState(initialSettings || {
    nombre: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    logo_url: '',
    ticket_footer_message: '',
    default_tax_rate: 0,
    currency: 'COP',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="xl:col-span-2 space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-primary mb-6 border-b border-primary/10 pb-2">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput 
              label="Nombre del Negocio" 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleChange} 
              required 
            />
            <TextInput 
              label="NIT" 
              name="nit" 
              value={formData.nit} 
              onChange={handleChange} 
              required 
            />
            <TextInput 
              label="Teléfono" 
              name="telefono" 
              value={formData.telefono} 
              onChange={handleChange} 
            />
            <TextInput 
              label="Email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
            />
            <div className="md:col-span-2">
              <TextInput 
                label="Dirección" 
                name="direccion" 
                value={formData.direccion} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-primary mb-6 border-b border-primary/10 pb-2">Impresión y Tickets</h3>
          <div className="space-y-4">
            <TextInput 
              label="URL del Logo" 
              name="logo_url" 
              value={formData.logo_url} 
              onChange={handleChange} 
              placeholder="https://..." 
            />
            <TextArea 
              label="Mensaje de Pie de Página" 
              name="ticket_footer_message" 
              value={formData.ticket_footer_message} 
              onChange={handleChange} 
              rows={3}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-primary mb-6 border-b border-primary/10 pb-2">Parámetros Operativos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput 
              label="IVA por Defecto (%)" 
              name="default_tax_rate" 
              type="number" 
              value={formData.default_tax_rate} 
              onChange={handleChange} 
            />
            <TextInput 
              label="Moneda" 
              name="currency" 
              value={formData.currency} 
              onChange={handleChange} 
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="px-8 py-3 font-bold text-white bg-primary hover:bg-primary/90 transition-all"
          >
            {isSaving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </form>

      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold text-primary mb-4">Previsualización de Ticket</h3>
        <TicketPreview settings={formData} />
        <p className="text-xs text-primary/50 mt-4 text-center px-4">
          Esta es una vista previa de cómo se verá la tirilla de venta con la configuración actual.
        </p>
      </div>
    </div>
  );
};
