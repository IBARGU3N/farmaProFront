import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar for desktop and mobile */}
      <Sidebar />

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top Header */}
        <TopBar />

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {/* Nested routes render here. The Suspense boundary in AppRoutes handles loading states for modules */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};


