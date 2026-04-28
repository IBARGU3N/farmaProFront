import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    // Only fetch if authenticated to avoid 401 loops on login page
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/configuracion');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching business settings:', error);
      // Do not show toast for 401/403 to avoid spamming during auth transitions
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error('Error al cargar la configuración del negocio');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only attempt fetch if we are actually authenticated
    if (isAuthenticated) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateSettings = async (newSettings) => {
    try {
      const response = await api.put('/configuracion', newSettings);
      setSettings(response.data.data);
      toast.success('Configuración actualizada correctamente');
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar la configuración';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
