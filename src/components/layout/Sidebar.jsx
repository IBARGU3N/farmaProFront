import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#DAFFED] border-r border-[#9BF3F0]/30 shadow-2xl">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-[#473198] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#473198]/20">
            F
          </div>
          <h1 className="text-2xl font-black text-[#473198] tracking-tighter italic">FARMAPRO</h1>
        </div>
        
        <nav className="space-y-1.5">
          <NavLink 
            to="/dashboard" 
            end 
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200
              ${isActive 
                ? 'bg-[#473198] text-white shadow-lg shadow-[#473198]/20 translate-x-1' 
                : 'text-[#473198]/60 hover:bg-[#9BF3F0]/20 hover:text-[#473198] hover:translate-x-1'}
            `}
          >
            <span className="mr-3 text-lg opacity-80">🏠</span>
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/pos" 
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200
              ${isActive 
                ? 'bg-[#473198] text-white shadow-lg shadow-[#473198]/20 translate-x-1' 
                : 'text-[#473198]/60 hover:bg-[#9BF3F0]/20 hover:text-[#473198] hover:translate-x-1'}
            `}
          >
            <span className="mr-3 text-lg opacity-80">🛒</span>
            Point of Sale
          </NavLink>
          
          <NavLink 
            to="/billing" 
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200
              ${isActive 
                ? 'bg-[#473198] text-white shadow-lg shadow-[#473198]/20 translate-x-1' 
                : 'text-[#473198]/60 hover:bg-[#9BF3F0]/20 hover:text-[#473198] hover:translate-x-1'}
            `}
          >
            <span className="mr-3 text-lg opacity-80">📄</span>
            Billing
          </NavLink>
          
          <NavLink 
            to="/inventory" 
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200
              ${isActive 
                ? 'bg-[#473198] text-white shadow-lg shadow-[#473198]/20 translate-x-1' 
                : 'text-[#473198]/60 hover:bg-[#9BF3F0]/20 hover:text-[#473198] hover:translate-x-1'}
            `}
          >
            <span className="mr-3 text-lg opacity-80">📦</span>
            Inventory
          </NavLink>
        </nav>
      </div>
      
      <div className="px-6 py-6 mt-auto border-t border-[#9BF3F0]/20 bg-white/40 backdrop-blur-sm">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-[#9BF3F0] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-[#473198] truncate">John Doe</p>
            <p className="text-[10px] text-[#473198]/50 font-bold uppercase tracking-wider">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};


