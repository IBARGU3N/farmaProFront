import React from 'react';
import { Card } from '../../../components/ui/Card';

const ResolutionsTable = ({ resolutions, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold text-primary/50 uppercase tracking-wider bg-surface-container-low/30 border-b border-primary-container/20">
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Prefijo</th>
              <th className="px-6 py-4">Rango</th>
              <th className="px-6 py-4">Actual</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-container/10">
            {resolutions.length > 0 ? resolutions.map((res) => (
              <tr key={res.id} className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-6 py-4 font-bold text-primary">{res.document_type}</td>
                <td className="px-6 py-4 text-sm text-primary/60">{res.prefix}</td>
                <td className="px-6 py-4 text-sm text-primary/60">
                  {res.initial_number} - {res.final_number}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-primary">
                  {res.current_number}
                </td>
                <td className="px-6 py-4 text-sm text-primary/60">
                  {new Date(res.resolution_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    res.is_active 
                      ? 'bg-success-container text-success' 
                      : 'bg-neutral-container text-neutral'
                  }`}>
                    {res.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(res)}
                      className="p-1.5 text-primary/50 hover:text-primary transition-colors"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(res.id)}
                      className="p-1.5 text-error hover:text-error/80 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-primary/40">
                  No hay resoluciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ResolutionsTable;
