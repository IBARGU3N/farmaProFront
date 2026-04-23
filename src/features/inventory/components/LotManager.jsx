import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const LotManager = ({ lots = [], onAddLot, onEditLot, onDeleteLot, onAdjustStock, isLoading }) => {
  const safeFormatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    try {
      return format(date, 'dd MMM yyyy', { locale: es });
    } catch (e) {
      return 'Error formato';
    }
  };

  const getLotStatus = (lot) => {
    if (!lot.fecha_vencimiento) return 'normal';
    const expDate = new Date(lot.fecha_vencimiento);
    if (isNaN(expDate.getTime())) return 'normal';
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring';
    if (lot.cantidad <= 10) return 'low';
    return 'normal';
  };

  const statusConfig = {
    expired: { bg: 'bg-red-50', text: 'text-red-700', label: 'Vencido', badge: 'bg-red-100 text-red-700' },
    expiring: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Proximo a vencer', badge: 'bg-yellow-100 text-yellow-700' },
    low: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Stock bajo', badge: 'bg-orange-100 text-orange-700' },
    normal: { bg: 'bg-surface/30', text: 'text-primary', label: 'Activo', badge: 'bg-green-100 text-green-700' },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         <h4 className="text-lg font-bold text-primary">Lotes</h4>
        <button
          onClick={onAddLot}
           className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-on-surface transition-colors"
        >
          + Nuevo Lote
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : lots.length === 0 ? (
         <div className="text-center py-8 text-primary/40">No hay lotes registrados</div>
      ) : (
        <div className="space-y-3">
          {lots.map((lot) => {
            const status = getLotStatus(lot);
            const config = statusConfig[status];
            return (
               <div key={lot.id} className={`p-4 rounded-xl border border-surface-container-low/20 ${config.bg} transition-all`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                       <span className="font-bold text-primary">Lote: {lot.lote}</span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${config.badge}`}>
                        {config.label}
                      </span>
                    </div>
                     <div className="flex items-center gap-6 mt-1 text-sm text-primary/60">
                       <span>Cantidad: <strong className="text-primary">{lot.cantidad}</strong></span>
                       <span>Vence: <strong className="text-primary">{safeFormatDate(lot.fecha_vencimiento)}</strong></span>
                       {lot.ubicacion && <span>Ubicacion: <strong className="text-primary">{lot.ubicacion}</strong></span>}
                       <span>P. Venta: <strong className="text-primary">${Number(lot.precio_venta).toLocaleString()}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAdjustStock(lot)}
                       className="px-3 py-1.5 text-xs font-bold text-primary bg-white border border-surface-container-low/30 rounded-lg hover:bg-surface-container-low/20 transition-colors"
                    >
                      Ajustar Stock
                    </button>
                    <button
                      onClick={() => onEditLot(lot)}
                       className="p-1.5 text-primary/50 hover:text-primary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteLot(lot.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
