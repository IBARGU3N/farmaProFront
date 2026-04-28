import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { DIProvider } from './lib/DIContainer';
import { queryClient } from './lib/queryClient';
import AppRoutes from './routes/AppRoutes';
import { useAuthInitializer } from './hooks/useAuthInitializer';
import { useThemeApplier } from './hooks/useThemeApplier';
import { ToastContainer } from './components/ui/ToastContainer';
import { BackgroundDecoration } from './components/ui/BackgroundDecoration';
import { SettingsProvider } from './context/SettingsContext';
import { bootstrapTheme } from './store/uiStore';
import { useLayoutEffect } from 'react';
import './index.css';

function App() {
  useLayoutEffect(() => {
    bootstrapTheme();
  }, []);

  useAuthInitializer();
  useThemeApplier();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DIProvider>
          <BackgroundDecoration />
          <ToastContainer />
          <SettingsProvider>
            <AppRoutes />
          </SettingsProvider>
        </DIProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
