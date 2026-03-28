import { NavLink, useNavigate } from 'react-router-dom';
import { useDI } from '../../lib/DIContainer';

export const TopBar = () => {
  const navigate = useNavigate();
  const { authService } = useDI(); // We'll implement DI container later

  const handleLogout = async () => {
    try {
      // TODO: Implement actual logout call
      // await authService.logout();
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed', error);
      // Still remove tokens and redirect even if API call fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="bg-white border-b border-[#9BF3F0]/20">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-md text-[#473198]/50 hover:bg-[#9BF3F0]/10"
            // TODO: Implement sidebar toggle for mobile
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#473198]">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-48 px-3 py-2 border border-[#9BF3F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9BF3F0]/50"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9BF3F0]/50" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414L4.476 10.89A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="relative">
            <button 
              className="p-2 rounded-md text-[#473198]/50 hover:bg-[#9BF3F0]/10"
              // TODO: Implement notifications dropdown
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 4a4 4 0 00-4 4v1h.582l-2 2V9a5 5 0 014.416-8.92l1.416.583a1 1 0 001.415-1.158l-.416-5.583a1 1 0 011.732-.416zm3.17 9.17a1 1 0 00-1.414 0l-.708.708a1 1 0 111.414-1.414l.708-.708a1 1 0 000-1.414zM17 12h-2v2h-2v-2h-2v-2h2V8h2v2h2v2zm-5 5a1 1 0 1000-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {/* Badge for notifications count */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#ADFC92] text-xs font-medium text-[#473198]">
                3
              </span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <img 
              src="https://via.placeholder.com/32" 
              alt="User" 
              className="w-8 h-8 rounded-full"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#473198]">John Doe</p>
              <p className="text-xs text-[#473198]/50">Administrator</p>
            </div>
          </div>
          <button 
            className="p-2 text-[#473198]/50 hover:text-[#473198]"
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};


