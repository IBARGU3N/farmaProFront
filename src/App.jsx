import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { DIProvider } from './lib/DIContainer';
import { queryClient } from './lib/queryClient';
import AppRoutes from './routes/AppRoutes';
import { useAuthInitializer } from './hooks/useAuthInitializer';
import { useThemeApplier } from './hooks/useThemeApplier';
import { ToastContainer } from './components/ui/ToastContainer';
import './index.css';

function App() {
  useAuthInitializer();
  useThemeApplier();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DIProvider>
          <ToastContainer />
          <AppRoutes />
        </DIProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
