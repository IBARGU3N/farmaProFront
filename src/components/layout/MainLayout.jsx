import { Outlet } from 'react-router-dom';
import { SidebarSmart } from './SidebarSmart';
import { TopBarSmart } from './TopBarSmart';

export const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface transition-colors duration-500">
      <SidebarSmart />

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <TopBarSmart />

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-surface-container-low dark:bg-surface-container-lowest transition-colors duration-500">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
