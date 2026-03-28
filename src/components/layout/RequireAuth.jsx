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
    return <div className="flex h-screen items-center justify-center bg-[#DAFFED]">Checking auth...</div>;
  }

  if (isError) {
    // Store the attempted location in state or localStorage to redirect after login
    localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  return children;
};


