import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../../services/dashboard/dashboardService';
import { useAuthStore } from '../../../store/authStore';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white/80 backdrop-blur-md border border-[#9BF3F0]/30 rounded-3xl shadow-xl shadow-[#473198]/5 p-6 hover:shadow-2xl hover:shadow-[#473198]/10 transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-[#473198]/50 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-[#473198] mt-2">{value}</p>
        {subtitle && <p className="text-xs text-[#473198]/40 mt-1">{subtitle}</p>}
      </div>
      <div className="text-[#473198]/40">
        {icon}
      </div>
    </div>
  </div>
);

const DashboardSmart = () => {
  const { user } = useAuthStore();

  const { data: statsData, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });

  const { data: salesChartData, isLoading: chartLoading, isError: chartError } = useQuery({
    queryKey: ['dashboard-sales-chart'],
    queryFn: () => dashboardService.getSalesChart(30),
  });

  const { data: topProductsData, isLoading: topLoading, isError: topError } = useQuery({
    queryKey: ['dashboard-top-products'],
    queryFn: () => dashboardService.getTopProducts(),
  });

  const { data: lowStockData, isLoading: lowStockLoading, isError: lowStockError } = useQuery({
    queryKey: ['dashboard-low-stock'],
    queryFn: () => dashboardService.getLowStock(),
  });

  const { data: expiringData, isLoading: expiringLoading, isError: expiringError } = useQuery({
    queryKey: ['dashboard-expiring-soon'],
    queryFn: () => dashboardService.getExpiringSoon(),
  });

  const { data: recentSalesData, isLoading: recentLoading, isError: recentError } = useQuery({
    queryKey: ['dashboard-recent-sales'],
    queryFn: () => dashboardService.getRecentSales(),
  });

  const stats = statsData?.data;
  const salesChart = salesChartData?.data || [];
  const topProducts = topProductsData?.data || [];
  const lowStock = lowStockData?.data || [];
  const expiringSoon = expiringData?.data || [];
  const recentSales = recentSalesData?.data || [];

  const chartData = salesChart
    .filter((item) => item?.date && !isNaN(parseFloat(item.total_revenue)))
    .map((item) => ({
      date: format(parseISO(item.date), 'dd MMM', { locale: es }),
      ventas: parseFloat(item.total_revenue) || 0,
      cantidad: parseInt(item.total_sales) || 0,
    }));

  if (statsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#473198] border-t-transparent mx-auto"></div>
          <p className="text-[#473198]/60 mt-4 font-bold">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-bold text-lg">Error al cargar el dashboard</p>
          <p className="text-[#473198]/60 mt-2">Por favor, intenta de nuevo mas tarde</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#DAFFED]/20 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#473198]">
          Hola, {user?.name || stats?.user?.name || 'Administrador'}
        </h1>
        <p className="text-[#473198]/60 mt-1">Resumen del sistema FarmaPro</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ventas Hoy"
          value={`$${Number(stats?.salesToday?.total_revenue || 0).toLocaleString()}`}
          subtitle={`${stats?.salesToday?.total_sales || 0} transacciones`}
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Ventas Semana"
          value={`$${Number(stats?.salesWeek?.total_revenue || 0).toLocaleString()}`}
          subtitle={`${stats?.salesWeek?.total_sales || 0} transacciones`}
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatCard
          title="Ventas Mes"
          value={`$${Number(stats?.salesMonth?.total_revenue || 0).toLocaleString()}`}
          subtitle={`${stats?.salesMonth?.total_sales || 0} transacciones`}
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          title="Alertas"
          value={stats?.summary?.total_alerts || 0}
          subtitle="Requieren atencion"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Productos"
          value={stats?.summary?.total_products || 0}
          subtitle="En catalogo"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
        />
        <StatCard
          title="Clientes"
          value={stats?.summary?.total_clients || 0}
          subtitle="Registrados"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          title="Lotes"
          value={stats?.summary?.total_lots || 0}
          subtitle="En inventario"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white/80 backdrop-blur-md border border-[#9BF3F0]/30 rounded-3xl shadow-xl shadow-[#473198]/5 p-6">
          <h3 className="text-lg font-bold text-[#473198] mb-4">Ventas Ultimos 30 Dias</h3>
          {chartLoading ? (
            <div className="h-64 flex items-center justify-center text-[#473198]/40">Cargando...</div>
          ) : chartError ? (
            <div className="h-64 flex items-center justify-center text-red-500">Error al cargar el grafico</div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9BF3F0/20" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#473198/60' }} />
                <YAxis tick={{ fontSize: 11, fill: '#473198/60' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #9BF3F0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(71,49,152,0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#473198"
                  strokeWidth={3}
                  dot={{ fill: '#473198', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-[#473198]/40">
              Sin datos de ventas aun
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white/80 backdrop-blur-md border border-[#9BF3F0]/30 rounded-3xl shadow-xl shadow-[#473198]/5 p-6">
          <h3 className="text-lg font-bold text-[#473198] mb-4">Top Productos Vendidos</h3>
          {topLoading ? (
            <div className="h-64 flex items-center justify-center text-[#473198]/40">Cargando...</div>
          ) : topError ? (
            <div className="h-64 flex items-center justify-center text-red-500">Error al cargar los datos</div>
          ) : topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topProducts.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9BF3F0/20" />
                <XAxis dataKey="nombre" tick={{ fontSize: 10, fill: '#473198/60' }} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#473198/60' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #9BF3F0',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="total_sold" fill="#473198" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-[#473198]/40">
              Sin datos de productos aun
            </div>
          )}
        </div>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Low Stock Alerts */}
        <div className="bg-white/80 backdrop-blur-md border border-[#9BF3F0]/30 rounded-3xl shadow-xl shadow-[#473198]/5 p-6">
          <h3 className="text-lg font-bold text-[#473198] mb-4">Stock Bajo</h3>
          {lowStockLoading ? (
            <p className="text-[#473198]/40">Cargando...</p>
          ) : lowStockError ? (
            <p className="text-red-500">Error al cargar las alertas</p>
          ) : lowStock.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {lowStock.slice(0, 10).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-[#DAFFED]/50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-[#473198]">{item.nombre}</p>
                    <p className="text-xs text-[#473198]/50">{item.codigo_barras}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    {item.total_stock} uds
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#473198]/40 text-sm">Todo el stock esta en niveles normales</p>
          )}
        </div>

        {/* Expiring Soon */}
        <div className="bg-white/80 backdrop-blur-md border border-[#9BF3F0]/30 rounded-3xl shadow-xl shadow-[#473198]/5 p-6">
          <h3 className="text-lg font-bold text-[#473198] mb-4">Proximos a Vencer</h3>
          {expiringLoading ? (
            <p className="text-[#473198]/40">Cargando...</p>
          ) : expiringError ? (
            <p className="text-red-500">Error al cargar las alertas</p>
          ) : expiringSoon.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {expiringSoon.slice(0, 10).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-[#473198]">{item.producto_nombre || item.producto?.nombre || 'Sin nombre'}</p>
                    <p className="text-xs text-[#473198]/50">Lote: {item.lote}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                    {item.fecha_vencimiento ? format(new Date(item.fecha_vencimiento), 'dd MMM', { locale: es }) : '—'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#473198]/40 text-sm">No hay productos proximos a vencer</p>
          )}
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white/80 backdrop-blur-md border border-[#9BF3F0]/30 rounded-3xl shadow-xl shadow-[#473198]/5 p-6">
        <h3 className="text-lg font-bold text-[#473198] mb-4">Ventas Recientes</h3>
        {recentLoading ? (
          <p className="text-[#473198]/40">Cargando...</p>
        ) : recentError ? (
          <p className="text-red-500 text-center py-8">Error al cargar las ventas recientes</p>
        ) : recentSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-[#473198]/50 uppercase tracking-wider border-b border-[#9BF3F0]/20">
                  <th className="pb-3 pr-4">Documento</th>
                  <th className="pb-3 pr-4">Cliente</th>
                  <th className="pb-3 pr-4">Cajero</th>
                  <th className="pb-3 pr-4 text-right">Total</th>
                  <th className="pb-3 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#9BF3F0]/10">
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#DAFFED]/30 transition-colors">
                    <td className="py-3 pr-4 text-sm font-bold text-[#473198]">{sale.numero_documento}</td>
                    <td className="py-3 pr-4 text-sm text-[#473198]/70">{sale.cliente || 'Venta general'}</td>
                    <td className="py-3 pr-4 text-sm text-[#473198]/70">{sale.cajero || '—'}</td>
                    <td className="py-3 pr-4 text-sm font-bold text-[#473198] text-right">
                      ${Number(sale.total).toLocaleString()}
                    </td>
                    <td className="py-3 text-sm text-[#473198]/50 text-right">
                      {sale.created_at ? format(new Date(sale.created_at), 'dd MMM HH:mm', { locale: es }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#473198]/40 text-sm text-center py-8">No hay ventas registradas aun</p>
        )}
      </div>
    </div>
  );
};

export default DashboardSmart;
