import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { alertService } from '../../services/dashboard/dashboardService';
import { useAlertStore } from '../../store/alertStore';

export const AlertBell = () => {
  const { alerts, alertCount, isOpen, setAlerts, setAlertCount, toggleOpen, closePanel, dismissAlert } = useAlertStore();

  const { data } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertService.getAll(),
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (data?.data) {
      const allAlerts = [];
      const d = data.data;

      if (d.low_stock?.length) {
        d.low_stock.forEach((item) => {
          allAlerts.push({
            type: 'low_stock',
            title: 'Stock bajo',
            message: `${item.nombre} tiene solo ${item.total_stock} unidades`,
            severity: 'warning',
          });
        });
      }

      if (d.expiring_soon?.length) {
        d.expiring_soon.forEach((item) => {
          allAlerts.push({
            type: 'expiring_soon',
            title: 'Proximo a vencer',
            message: `${item.producto_nombre} (Lote: ${item.lote}) vence el ${item.fecha_vencimiento}`,
            severity: 'warning',
          });
        });
      }

      if (d.expired?.length) {
        d.expired.forEach((item) => {
          allAlerts.push({
            type: 'expired',
            title: 'Vencido',
            message: `${item.producto_nombre} (Lote: ${item.lote}) esta vencido`,
            severity: 'error',
          });
        });
      }

      if (d.overdue_payables?.length) {
        d.overdue_payables.forEach((item) => {
          allAlerts.push({
            type: 'overdue',
            title: 'Pago vencido',
            message: `${item.concepto} - ${item.proveedor} - $${Number(item.valor).toLocaleString()}`,
            severity: 'error',
          });
        });
      }

      setAlerts(allAlerts);
      setAlertCount(allAlerts.length);
    }
  }, [data, setAlerts, setAlertCount]);

  const severityColors = {
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    error: 'bg-red-100 border-red-300 text-red-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800',
  };

  const severityIcons = {
    warning: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 text-primary/60 hover:text-primary transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {alertCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {alertCount > 9 ? '9+' : alertCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={closePanel} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-secondary/30 z-50 overflow-hidden">
            <div className="p-4 border-b border-secondary/20">
              <h3 className="text-sm font-bold text-primary">Notificaciones ({alertCount})</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {alerts.length > 0 ? alerts.map((alert, i) => (
                <div key={i} className={`p-3 border-b border-secondary/10 ${severityColors[alert.severity]}`}>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">{severityIcons[alert.severity]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold">{alert.title}</p>
                      <p className="text-[10px] opacity-70 mt-0.5">{alert.message}</p>
                    </div>
                    <button
                      onClick={() => dismissAlert(i)}
                      className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-primary/40 text-sm">
                  No hay notificaciones
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
