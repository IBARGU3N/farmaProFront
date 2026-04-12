import { Outlet } from 'react-router-dom';
import { SidebarSmart } from './SidebarSmart';
import { TopBarSmart } from './TopBarSmart';

export const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSmart />

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <TopBarSmart />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
