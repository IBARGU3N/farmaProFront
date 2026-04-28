import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import { authStorage } from '../../lib/authStorage';
import { useAuthStore } from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import { useSettings } from '../../context/SettingsContext';
import { TopBar } from './TopBar';
import { AlertBell } from '../ui/AlertBell';

export const TopBarSmart = () => {
  const navigate = useNavigate();
  const { user, logout: logoutStore } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const { settings } = useSettings();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm('Desea cerrar sesion?');
    if (!confirmed) return;

    try {
      await authService.logout();
    } catch {
      // Optimistic logout
    } finally {
      authStorage.clearTokens();
      logoutStore();
      navigate('/login', { replace: true });
    }
  };

  return (
    <TopBar
      user={user}
      currentTime={currentTime}
      onLogout={handleLogout}
      isDark={theme === 'dark'}
      onToggleDark={toggleTheme}
      AlertBellComponent={AlertBell}
      settings={settings}
    />
  );
};
