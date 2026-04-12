import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '../../../services/invoice/invoiceService';
import { Card } from '../../../components/ui/Card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const InvoiceSmart = () => {
  const [filters, setFilters] = useState({ start_date: '', end_date: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => invoiceService.getAll(filters),
  });

  const invoices = data?.data?.data || data?.data || [];

  return (
    <div className="p-6 bg-[#DAFFED]/20 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#473198]">Facturas</h1>
          <p className="text-[#473198]/60 mt-1">Historial de facturas</p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
            className="px-4 py-2 border border-[#9BF3F0]/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
          />
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
            className="px-4 py-2 border border-[#9BF3F0]/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#473198] border-t-transparent"></div>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-[#473198]/50 uppercase tracking-wider bg-[#DAFFED]/30 border-b border-[#9BF3F0]/20">
                  <th className="px-6 py-4">Documento</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4 text-right">Subtotal</th>
                  <th className="px-6 py-4 text-right">Impuestos</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#9BF3F0]/10">
                {invoices.length > 0 ? invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#DAFFED]/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#473198]">{inv.numero_documento}</td>
                    <td className="px-6 py-4 text-sm text-[#473198]/60">{inv.tercero?.razon_social_o_nombre || 'General'}</td>
                    <td className="px-6 py-4 text-sm text-[#473198]/60">{inv.tipo_transaccion}</td>
                    <td className="px-6 py-4 text-sm text-[#473198] text-right">${Number(inv.subtotal).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-[#473198]/60 text-right">${Number(inv.total_impuestos).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-black text-[#473198] text-right">${Number(inv.total).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-[#473198]/50 text-right">
                      {inv.created_at ? format(new Date(inv.created_at), 'dd MMM yyyy HH:mm', { locale: es }) : '—'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[#473198]/40">
                      No se encontraron facturas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InvoiceSmart;
