import React from 'react';
import { Edit, Trash2, Lock, Unlock, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ShortcutBadge } from '../../../components/ui/ShortcutBadge';

export const CajaTable = ({ cajas, onEdit, onDelete, onToggleStatus, onAddNew, onArqueo }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-primary">Gestión de Cajas</h2>
          <p className="text-on-surface-variant text-sm">Administra las cajas de tu sucursal</p>
        </div>
         <div className="flex gap-3">
           <Button onClick={() => onArqueo()} variant="secondary" className="flex items-center gap-2">
             <span>Arqueo de Caja</span>
             <ShortcutBadge keys="F2" />
           </Button>
           <Button onClick={onAddNew} variant="primary" className="flex items-center gap-2">
             <Plus size={18} />
             <span>Nueva Caja</span>
             <ShortcutBadge keys="Alt+N" />
           </Button>
         </div>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-primary-container/20 text-on-surface-variant text-sm uppercase tracking-wider">
              <th className="pb-4 font-bold">Nombre</th>
              <th className="pb-4 font-bold">Balance Inicial</th>
              <th className="pb-4 font-bold">Estado</th>
              <th className="pb-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-container/10">
            {cajas.length > 0 ? (
              cajas.map((caja) => (
                <tr key={caja.id} className="hover:bg-primary-container/5 transition-colors group">
                  <td className="py-4 font-medium text-on-surface">{caja.nombre}</td>
                  <td className="py-4 text-on-surface-variant">
                    ${Number(caja.balance_inicial).toLocaleString()}
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      caja.estado === 'ABIERTA' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {caja.estado}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => onToggleStatus(caja)}
                        className={caja.estado === 'ABIERTA' ? 'text-orange-500' : 'text-green-500'}
                        title={caja.estado === 'ABIERTA' ? 'Cerrar Caja' : 'Abrir Caja'}
                      >
                        {caja.estado === 'ABIERTA' ? <Lock size={16} /> : <Unlock size={16} />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => onEdit(caja)}
                        className="text-primary"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => onDelete(caja.id)}
                        className="text-error"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-on-surface-variant italic">
                  No hay cajas registradas en tu sucursal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
