import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/auth/authService';

export const RequireAuth = ({ children }) => {
  const location = useLocation();

  const { isLoading, isError } = useQuery({
    queryKey: ['auth-check'],
    queryFn: () => authService.checkAuth(),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#DAFFED]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#9BF3F0] border-t-[#473198] rounded-full animate-spin" />
          <p className="text-[#473198] font-black text-xs uppercase tracking-widest animate-pulse">Checking Auth...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    // Store the attempted location in state or localStorage to redirect after login
    localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  return children;
};


