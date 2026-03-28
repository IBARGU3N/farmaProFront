import { Card } from '../../../components/ui/Card';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../../services/dashboard/dashboardService';

const DashboardSmart = () => {
  const {
    data: profileResponse,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => dashboardService.getProfile(),
    retry: false,
  });

  const {
    data: statsResponse,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    retry: false,
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center text-[#473198]">Loading dashboard...</div>;
  if (isError) return <div className="flex h-screen items-center justify-center text-[#473198]">Error loading dashboard</div>;

  return (
    <div className="p-8 bg-[#DAFFED]/20 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#473198]">Welcome back, {user?.name || 'Administrator'}</h1>
        <p className="text-[#473198]/60 mt-2">Here is what is happening with FarmaPro today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white hover:border-[#9BF3F0] transition-colors">
          <h3 className="text-sm font-semibold text-[#473198]/50 uppercase tracking-wider mb-2">Today's Sales</h3>
          <p className="text-3xl font-bold text-[#473198]">$0.00</p>
          <div className="mt-4 flex items-center text-xs font-medium text-gray-400">
            <span>No sales records found</span>
          </div>
        </Card>

        <Card className="p-6 bg-white hover:border-[#9BF3F0] transition-colors">
          <h3 className="text-sm font-semibold text-[#473198]/50 uppercase tracking-wider mb-2">Pending Invoices</h3>
          <p className="text-3xl font-bold text-[#473198]">0</p>
          <div className="mt-4 flex items-center text-xs font-medium text-gray-400">
            <span>All up to date</span>
          </div>
        </Card>

        <Card className="p-6 bg-white hover:border-[#9BF3F0] transition-colors">
          <h3 className="text-sm font-semibold text-[#473198]/50 uppercase tracking-wider mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-[#473198]">0</p>
          <div className="mt-4 flex items-center text-xs font-medium text-gray-400">
            <span>Inventory is full</span>
          </div>
        </Card>

        <Card className="p-6 bg-white hover:border-[#9BF3F0] transition-colors">
          <h3 className="text-sm font-semibold text-[#473198]/50 uppercase tracking-wider mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold text-[#473198]">1</p>
          <div className="mt-4 flex items-center text-xs font-medium text-[#ADFC92] font-bold">
            <span>Currently online</span>
          </div>
        </Card>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold text-[#473198] mb-4">Recent Activity</h2>
        <Card className="bg-white overflow-hidden">
          <div className="p-6 text-center">
            <p className="text-[#473198]/40 text-sm">No recent activity recorded in the system.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSmart;

