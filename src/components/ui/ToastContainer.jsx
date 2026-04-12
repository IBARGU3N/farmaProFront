import { useEffect } from 'react';
import { Toast } from './Toast';
import useUIStore from '../../store/uiStore';

export const ToastContainer = () => {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  return <Toast message={toast.message} type={toast.type} onClose={hideToast} />;
};