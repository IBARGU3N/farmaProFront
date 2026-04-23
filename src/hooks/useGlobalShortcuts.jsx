import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

/**
 * Hook global de atajos de navegación.
 * Se monta una sola vez en el layout principal (MainLayout).
 *
 * Atajos:
 *  Alt+D → /dashboard
 *  Alt+P → /pos
 *  Alt+I → /inventory
 *  Alt+C → /clients
 *  Alt+R → /reports
 *  Alt+O → /compras
 *  /     → Enfocar el primer input[type="search"] o input[placeholder*="Buscar"] visible
 *  ?     → Mostrar panel de ayuda de atajos (toast informativo)
 */
export const useGlobalShortcuts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const goTo = useCallback((path, name) => {
    if (!isAuthenticated) return;
    if (location.pathname.startsWith(path)) {
      toast(`Ya estás en ${name}`, { icon: 'ℹ️', duration: 1500 });
      return;
    }
    navigate(path);
    toast.success(`Navegando a ${name}`, { duration: 1500 });
  }, [navigate, location.pathname, isAuthenticated]);

  const focusSearch = useCallback(() => {
    // Busca el primer campo de búsqueda visible en la página
    const searchInput =
      document.querySelector('input[type="search"]') ||
      document.querySelector('input[placeholder*="Buscar"]') ||
      document.querySelector('input[placeholder*="buscar"]') ||
      document.querySelector('input[placeholder*="codigo"]');

    if (searchInput) {
      searchInput.focus();
      searchInput.select();
      toast('Campo de búsqueda enfocado', { icon: '🔍', duration: 1200 });
    }
  }, []);

  const showHelp = useCallback(() => {
    toast(
      (t) => (
        <div style={{ maxWidth: 340, fontSize: 13, lineHeight: 1.6 }}>
          <strong style={{ fontSize: 15 }}>⌨️ Atajos de Teclado</strong>
          <hr style={{ margin: '6px 0', opacity: 0.2 }} />
          <div><b>Alt+D</b> — Dashboard</div>
          <div><b>Alt+P</b> — Punto de Venta</div>
          <div><b>Alt+I</b> — Inventario</div>
          <div><b>Alt+C</b> — Clientes</div>
          <div><b>Alt+R</b> — Reportes</div>
          <div><b>Alt+O</b> — Compras</div>
          <hr style={{ margin: '6px 0', opacity: 0.2 }} />
          <div><b>/</b> — Enfocar búsqueda</div>
          <div><b>Alt+N</b> — Nuevo registro</div>
          <div><b>Ctrl+S</b> — Guardar formulario</div>
          <div><b>F12</b> — Procesar venta/compra</div>
          <div><b>Esc</b> — Cancelar / cerrar</div>
          <hr style={{ margin: '6px 0', opacity: 0.2 }} />
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              marginTop: 4,
              padding: '4px 12px',
              borderRadius: 8,
              border: '1px solid var(--sys-primary)',
              background: 'transparent',
              color: 'var(--sys-primary)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            Cerrar
          </button>
        </div>
      ),
      { duration: 12000, position: 'bottom-right' }
    );
  }, []);

  useKeyboardShortcuts([
    { key: 'd', alt: true, action: () => goTo('/dashboard', 'Dashboard') },
    { key: 'p', alt: true, action: () => goTo('/pos', 'Punto de Venta') },
    { key: 'i', alt: true, action: () => goTo('/inventory', 'Inventario') },
    { key: 'c', alt: true, action: () => goTo('/clients', 'Clientes') },
    { key: 'r', alt: true, action: () => goTo('/reports', 'Reportes') },
    { key: 'o', alt: true, action: () => goTo('/compras', 'Compras') },
    { key: '/', action: focusSearch },
    { key: '?', shift: true, action: showHelp },
  ]);
};
