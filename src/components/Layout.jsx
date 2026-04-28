import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';

export const Layout = ({ children }) => {
  const { user } = useAuthStore();
  const { theme } = useUIStore();

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${theme === 'dark' ? 'bg-surface text-on-surface' : 'bg-surface text-primary'}`}>
      <aside className="w-64 bg-surface-container-low border-r border-on-surface/10 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg" />
          <span className="font-black text-xl tracking-tighter">FarmaPro</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {/* Navigation items would go here */}
        </nav>
        <div className="p-4 border-t border-on-surface/10">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-lowest border border-on-surface/5">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.name || 'Usuario'}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{user?.role || 'Staff'}</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-surface-container-lowest border-b border-on-surface/10 flex items-center justify-between px-8">
          <div className="text-sm font-medium text-on-surface-variant">Panel de Control</div>
          <div className="flex items-center gap-4">
            {/* Theme toggle or other header tools */}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 bg-surface">
          {children}
        </div>
      </main>
    </div>
  );
};