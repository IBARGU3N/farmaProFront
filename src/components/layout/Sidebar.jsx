import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#DAFFED] border-r border-[#9BF3F0]/20">
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-[#473198] mb-6">FarmaPro</h1>
        <nav className="space-y-2">
          <NavLink 
            to="/dashboard" 
            end 
            className={( { isActive } ) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${isActive ? 'bg-[#9BF3F0]/20 text-[#473198]' : 'text-[#473198]/50 hover:bg-[#9BF3F0]/10'}
            `}
          >
            <span className="mr-3">🏠</span>
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/pos" 
            className={( { isActive } ) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${isActive ? 'bg-[#9BF3F0]/20 text-[#473198]' : 'text-[#473198]/50 hover:bg-[#9BF3F0]/10'}
            `}
          >
            <span className="mr-3">🛒</span>
            Point of Sale
          </NavLink>
          
          <NavLink 
            to="/billing" 
            className={( { isActive } ) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${isActive ? 'bg-[#9BF3F0]/20 text-[#473198]' : 'text-[#473198]/50 hover:bg-[#9BF3F0]/10'}
            `}
          >
            <span className="mr-3">📄</span>
            Billing
          </NavLink>
          
          <NavLink 
            to="/inventory" 
            className={( { isActive } ) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium 
              ${isActive ? 'bg-[#9BF3F0]/20 text-[#473198]' : 'text-[#473198]/50 hover:bg-[#9BF3F0]/10'}
            `}
          >
            <span className="mr-3">📦</span>
            Inventory
          </NavLink>
        </nav>
      </div>
      
      <div className="px-4 py-4 mt-auto border-t border-[#9BF3F0]/20">
        <div className="flex items-center space-x-3">
          <img 
            src="https://via.placeholder.com/32" 
            alt="User" 
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#473198]">John Doe</p>
            <p className="text-xs text-[#473198]/50">Administrator</p>
          </div>
          <button 
            className="p-2 text-[#473198]/50 hover:text-[#473198]"
            onClick={() => {
              // TODO: Implement logout
              alert('Logout functionality to be implemented');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};


