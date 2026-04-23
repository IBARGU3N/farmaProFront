import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { initAntiInspect } from './utils/antiInspect';

if (import.meta.env.PROD) {
  initAntiInspect();
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
  console.info = () => {};
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--sys-surface-container-low)',
          color: 'var(--sys-on-surface)',
          border: '1px solid var(--sys-primary)',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: 'var(--sys-primary)',
            secondary: 'var(--sys-on-primary)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff6b6b',
            secondary: '#fff',
          },
        },
      }}
    />
    <App />
  </React.StrictMode>
);
