import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

if (import.meta.env.PROD) {
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
          background: '#473198',
          color: '#fff',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#ADFC92',
            secondary: '#473198',
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
