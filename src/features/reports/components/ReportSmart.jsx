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

  const { data, isLoading } = useQuery({
    queryKey: ['report', reportType, dateRange],
    queryFn: () => {
      if (reportType === 'sales') return reportService.getSales(dateRange);
      if (reportType === 'inventory') return reportService.getInventory();
      if (reportType === 'financial') return reportService.getFinancial(dateRange);
    },
    enabled: !!reportType,
  });

  const reportData = data?.data || {};

  return (
    <div className="p-6 bg-[#DAFFED]/20 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#473198]">Reportes</h1>
          <p className="text-[#473198]/60 mt-1">Análisis y reportes del sistema</p>
        </div>
        <div className="flex gap-3">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border border-[#9BF3F0]/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
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
                className="px-4 py-2 border border-[#9BF3F0]/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                className="px-4 py-2 border border-[#9BF3F0]/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
            </>
          )}
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#473198] border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          {reportType === 'sales' && reportData.summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <p className="text-xs text-[#473198]/50 font-bold uppercase">Total Facturas</p>
                <p className="text-3xl font-black text-[#473198] mt-2">{reportData.summary.total_invoices || 0}</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-xs text-[#473198]/50 font-bold uppercase">Subtotal</p>
                <p className="text-3xl font-black text-[#473198] mt-2">${Number(reportData.summary.total_subtotal || 0).toLocaleString()}</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-xs text-[#473198]/50 font-bold uppercase">Impuestos</p>
                <p className="text-3xl font-black text-[#473198] mt-2">${Number(reportData.summary.total_taxes || 0).toLocaleString()}</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-xs text-[#473198]/50 font-bold uppercase">Total</p>
                <p className="text-3xl font-black text-[#473198] mt-2">${Number(reportData.summary.total_amount || 0).toLocaleString()}</p>
              </Card>
            </div>
          )}

          {/* Report Table */}
          <Card className="overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#473198] mb-4">
                {reportType === 'sales' ? 'Detalle de Ventas' : reportType === 'inventory' ? 'Inventario Completo' : 'Reporte Financiero'}
              </h3>
              {reportData.invoices ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-[#473198]/50 uppercase tracking-wider border-b border-[#9BF3F0]/20">
                        <th className="pb-3 pr-4">Documento</th>
                        <th className="pb-3 pr-4">Cliente</th>
                        <th className="pb-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#9BF3F0]/10">
                      {reportData.invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-[#DAFFED]/30">
                          <td className="py-3 pr-4 text-sm font-bold text-[#473198]">{inv.numero_documento}</td>
                          <td className="py-3 pr-4 text-sm text-[#473198]/60">{inv.tercero?.razon_social_o_nombre || 'General'}</td>
                          <td className="py-3 text-sm font-black text-[#473198] text-right">${Number(inv.total).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[#473198]/40 text-center py-8">Sin datos para el período seleccionado</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportSmart;
