import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { DIProvider } from './lib/DIContainer';
import { queryClient } from './lib/queryClient';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DIProvider>
          <AppRoutes />
        </DIProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
