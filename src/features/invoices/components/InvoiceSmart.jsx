import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '../../../services/invoice/invoiceService';
import { Card } from '../../../components/ui/Card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const InvoiceSmart = () => {
  const [filters, setFilters] = useState({ 
    date_from: '', 
    date_to: '', 
    customer_name: '', 
    page: 1 
  });

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => invoiceService.getAll(filters),
  });

  const pagination = data?.data;
  const invoices = pagination?.data || [];
  const currentPage = pagination?.current_page || 1;
  const lastPage = pagination?.last_page || 1;

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  return (
    <div className="p-6 bg-surface/20 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-black text-primary">Facturas</h1>
           <p className="text-primary/60 mt-1">Historial de facturas</p>

        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={filters.customer_name}
            onChange={(e) => setFilters({ ...filters, customer_name: e.target.value, page: 1 })}
             className="px-4 py-2 border border-secondary/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"

          />
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => setFilters({ ...filters, date_from: e.target.value, page: 1 })}
             className="px-4 py-2 border border-secondary/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"

          />
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => setFilters({ ...filters, date_to: e.target.value, page: 1 })}
             className="px-4 py-2 border border-secondary/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"

          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
           <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>

        </div>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                   <tr className="text-left text-xs font-bold text-primary/50 uppercase tracking-wider bg-surface/30 border-b border-secondary/20">

                    <th className="px-6 py-4">Documento</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                    <th className="px-6 py-4 text-right">Impuestos</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-right">Fecha</th>
                  </tr>
                </thead>
                 <tbody className="divide-y divide-secondary/10">

                  {invoices.length > 0 ? invoices.map((inv) => (
                     <tr key={inv.id} className="hover:bg-surface/30 transition-colors">

                       <td className="px-6 py-4 font-bold text-primary">{inv.numero_documento}</td>

                       <td className="px-6 py-4 text-sm text-primary/60">{inv.tercero?.razon_social_o_nombre || 'General'}</td>

                       <td className="px-6 py-4 text-sm text-primary/60">{inv.tipo_transaccion}</td>

                       <td className="px-6 py-4 text-sm text-primary text-right">${Number(inv.subtotal).toLocaleString()}</td>

                       <td className="px-6 py-4 text-sm text-primary/60 text-right">${Number(inv.total_impuestos).toLocaleString()}</td>

                       <td className="px-6 py-4 text-sm font-black text-primary text-right">${Number(inv.total).toLocaleString()}</td>

                       <td className="px-6 py-4 text-sm text-primary/50 text-right">

                        {inv.created_at ? format(new Date(inv.created_at), 'dd MMM yyyy HH:mm', { locale: es }) : '—'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan="7" className="px-6 py-12 text-center text-primary/40">

                        No se encontraron facturas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex items-center justify-between mt-6 px-2">
             <p className="text-sm text-primary/60">

              Mostrando página {currentPage} de {lastPage}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                 className="px-4 py-2 text-sm font-bold text-primary bg-white border border-secondary/30 rounded-xl disabled:opacity-50 hover:bg-surface/30 transition-colors"

              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                 className="px-4 py-2 text-sm font-bold text-primary bg-white border border-secondary/30 rounded-xl disabled:opacity-50 hover:bg-surface/30 transition-colors"

              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


export default InvoiceSmart;
