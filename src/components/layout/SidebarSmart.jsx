import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import { authStorage } from '../../lib/authStorage';
import { useAuthStore } from '../../store/authStore';
import { Sidebar } from './Sidebar';

const navItems = [
  { to: '/dashboard', end: true, iconKey: 'dashboard', label: 'Dashboard' },
  { to: '/pos', end: true, iconKey: 'pos', label: 'Punto de Venta' },
  { to: '/inventory', end: true, iconKey: 'inventory', label: 'Inventario' },
  { to: '/clients', end: true, iconKey: 'clients', label: 'Clientes' },
  { to: '/suppliers', end: true, iconKey: 'suppliers', label: 'Proveedores' },
  { to: '/invoices', end: true, iconKey: 'invoices', label: 'Facturas' },
  { to: '/cajas', end: true, iconKey: 'pos', label: 'Cajas' },
  { to: '/reports', end: true, iconKey: 'reports', label: 'Reportes' },
  { to: '/settings', end: true, iconKey: 'settings', label: 'Configuracion' },
  { to: '/users', end: true, iconKey: 'users', label: 'Usuarios' },
];

export const SidebarSmart = () => {
  const navigate = useNavigate();
  const { user, logout: logoutStore } = useAuthStore();

  const handleLogout = async () => {
    const confirmed = window.confirm('Desea cerrar sesion?');
    if (!confirmed) return;

    try {
      await authService.logout();
    } catch {
      // Optimistic: continue even if server call fails
    } finally {
      authStorage.clearTokens();
      logoutStore();
      navigate('/login', { replace: true });
    }
  };

  return <Sidebar user={user} onLogout={handleLogout} navItems={navItems} />;
};
