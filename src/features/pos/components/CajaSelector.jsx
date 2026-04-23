import React from 'react';
import { Card } from '../../../components/ui/Card';

export const CajaSelector = ({ cajas, selectedCajaId, onSelectCaja }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cajas.map((caja) => (
        <Card
          key={caja.id}
          className={`p-4 cursor-pointer transition-all border-2 ${
            selectedCajaId === caja.id
              ? 'border-primary bg-surface-container-low/50 dark:bg-surface-container-lowest/50 shadow-md'
              : 'border-secondary/30 hover:border-primary/30'
          }`}
          onClick={() => onSelectCaja(caja.id)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-primary">{caja.nombre}</p>
               <p className={`text-xs font-bold uppercase ${caja.estado === 'open' ? 'text-green-600' : 'text-error'}`}>
                 {caja.estado === 'open' ? 'Abierta' : 'Cerrada'}
               </p>

            </div>
            <div className={`w-4 h-4 rounded-full ${selectedCajaId === caja.id ? 'bg-primary' : 'bg-gray-200'}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};
