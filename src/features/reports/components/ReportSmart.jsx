import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../../services/dashboard/dashboardService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ReportSmart = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['report', reportType, dateRange],
    queryFn: () => {
      if (reportType === 'sales') return reportService.getSales(dateRange);
      if (reportType === 'inventory') return reportService.getInventory();
      if (reportType === 'financial') return reportService.getFinancial(dateRange);
    },
    enabled: !!reportType,
  });

  const reportData = data?.data || data || {};

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      const method = format === 'pdf' ? 'exportPdf' : 'exportExcel';
      const response = await reportService[method](reportType, dateRange);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'pdf' ? 'pdf' : 'csv';
      const filename = `Reporte_${reportType}_${new Date().toISOString().split('T')[0]}.${extension}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error al exportar el reporte: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 bg-surface-container-low/20 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary">Reportes</h1>
          <p className="text-primary/60 mt-1">Análisis y reportes del sistema</p>
        </div>
        <div className="flex gap-3">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border border-primary-container/30 rounded-xl bg-surface/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="sales">Reporte de Ventas</option>
            <option value="inventory">Reporte de Inventario</option>
            <option value="financial">Reporte Financiero</option>
          </select>
          {reportType !== 'inventory' && (
            <>
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                className="px-4 py-2 border border-primary-container/30 rounded-xl bg-surface/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                className="px-4 py-2 border border-primary-container/30 rounded-xl bg-surface/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </>
          )}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleExport('pdf')} 
              disabled={isExporting} 
              className="flex items-center border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent mr-2" />
              ) : (
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExport('excel')} 
              disabled={isExporting} 
              className="flex items-center border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent mr-2" />
              ) : (
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              Excel
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {reportType === 'sales' && reportData.summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <p className="text-xs text-primary/50 font-bold uppercase">Total Facturas</p>
                <p className="text-3xl font-black text-primary mt-2">{reportData.summary.total_invoices || 0}</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-xs text-primary/50 font-bold uppercase">Subtotal</p>
                <p className="text-3xl font-black text-primary mt-2">${Number(reportData.summary.total_subtotal || 0).toLocaleString()}</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-xs text-primary/50 font-bold uppercase">Impuestos</p>
                <p className="text-3xl font-black text-primary mt-2">${Number(reportData.summary.total_taxes || 0).toLocaleString()}</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-xs text-primary/50 font-bold uppercase">Total</p>
                <p className="text-3xl font-black text-primary mt-2">${Number(reportData.summary.total_amount || 0).toLocaleString()}</p>
              </Card>
            </div>
          )}

          <Card className="overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                {reportType === 'sales' ? 'Detalle de Ventas' : reportType === 'inventory' ? 'Inventario Completo' : 'Reporte Financiero'}
              </h3>
              
              {reportType === 'sales' && reportData.invoices ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-primary/50 uppercase tracking-wider border-b border-primary-container/20">
                        <th className="pb-3 pr-4">Documento</th>
                        <th className="pb-3 pr-4">Cliente</th>
                        <th className="pb-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-container/10">
                      {reportData.invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-surface-container-low/30">
                          <td className="py-3 pr-4 text-sm font-bold text-primary">{inv.numero_documento}</td>
                          <td className="py-3 pr-4 text-sm text-primary/60">{inv.tercero?.razon_social_o_nombre || 'General'}</td>
                          <td className="py-3 text-sm font-black text-primary text-right">${Number(inv.total).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : reportType === 'inventory' && Array.isArray(reportData) ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-primary/50 uppercase tracking-wider border-b border-primary-container/20">
                        <th className="pb-3 pr-4">Producto</th>
                        <th className="pb-3 pr-4">Categoría</th>
                        <th className="pb-3 pr-4">Laboratorio</th>
                        <th className="pb-3 text-right">Stock</th>
                        <th className="pb-3 text-right">Vencimiento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-container/10">
                      {reportData.map((p) => (
                        <tr key={p.id} className="hover:bg-surface-container-low/30">
                          <td className="py-3 pr-4 text-sm font-bold text-primary">{p.nombre}</td>
                          <td className="py-3 pr-4 text-sm text-primary/60">{p.categoria || '—'}</td>
                          <td className="py-3 pr-4 text-sm text-primary/60">{p.laboratorio || '—'}</td>
                          <td className="py-3 text-sm font-black text-primary text-right">{p.total_stock}</td>
                          <td className="py-3 text-sm text-primary/50 text-right">{p.nearest_expiration || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : reportType === 'financial' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-4">
                    <h4 className="text-sm font-bold text-primary mb-3">Ventas</h4>
                    <div className="space-y-2">
                      {reportData.sales ? (
                        <div className="flex justify-between text-sm">
                          <span>Total Recaudado:</span>
                          <span className="font-bold">${Number(reportData.sales.total_amount || 0).toLocaleString()}</span>
                        </div>
                      ) : <p className="text-xs text-primary/40">Sin datos</p>}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="text-sm font-bold text-primary mb-3">Cuentas por Pagar</h4>
                    <div className="space-y-2">
                      {reportData.accounts_payable?.map((ap, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="capitalize">{ap.estado}:</span>
                          <span className="font-bold">${Number(ap.total || 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="text-sm font-bold text-primary mb-3">Movimientos de Caja</h4>
                    <div className="space-y-2">
                      {reportData.cash_movements?.map((cm, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="capitalize">{cm.tipo_movimiento}:</span>
                          <span className="font-bold">${Number(cm.total || 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : (
                <p className="text-primary/40 text-center py-8">Sin datos para el período seleccionado</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportSmart;

