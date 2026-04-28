import React from 'react';

export const TicketPreview = ({ settings }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-inner border border-gray-200 w-full max-w-[300px] mx-auto text-black font-mono text-xs">
      <div className="text-center border-b border-dashed border-gray-300 pb-2 mb-2">
        {settings?.logo_url && (
          <img src={settings.logo_url} alt="Logo" className="h-12 w-12 object-contain mx-auto mb-2" />
        )}
        <h3 className="font-bold uppercase">{settings?.nombre || 'NOMBRE DE LA DROGUERÍA'}</h3>
        <p>{settings?.nit ? `NIT: ${settings.nit}` : 'NIT: 000.000.000-0'}</p>
        <p>{settings?.direccion || 'Dirección de la droguería'}</p>
        <p>{settings?.telefono || 'Teléfono de contacto'}</p>
      </div>
      
      <div className="py-4 text-center">
        <p className="font-bold mb-1">RECIBO DE VENTA</p>
        <div className="border-b border-dashed border-gray-300 my-2" />
        <div className="text-left space-y-1">
          <div className="flex justify-between">
            <span>Producto A x 1</span>
            <span>$ 10.000</span>
          </div>
          <div className="flex justify-between">
            <span>Producto B x 2</span>
            <span>$ 20.000</span>
          </div>
          <div className="border-t border-gray-300 my-1 pt-1 flex justify-between font-bold">
            <span>TOTAL</span>
            <span>{settings?.currency || '$'} 30.000</span>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-dashed border-gray-300 pt-2 mt-2 italic">
        <p>{settings?.ticket_footer_message || 'Gracias por su compra. ¡Vuelva pronto!'}</p>
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="w-full h-4 bg-gray-100 rounded-sm" />
      </div>
    </div>
  );
};
