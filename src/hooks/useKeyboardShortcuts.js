import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Sistema de Atajos de Teclado para FarmaPro.

 *
 * Reglas:
 * - Los listeners se configuran SOLO en componentes Smart o hooks globales.
 * - Los componentes Dumb no gestionan keydown.
 * - event.preventDefault() se aplica en todas las teclas capturadas para
 *   evitar comportamientos nativos del navegador (F12 DevTools, Ctrl+S guardar, etc.).
 * - Si el foco está en un campo de texto (<input>, <textarea>, <select>),
 *   los atajos de una sola tecla (sin modificadores) se IGNORAN para no
 *   interrumpir la escritura. Los combinados (Ctrl/Alt) siempre aplican.
 *
 * @param {Array<{
 *   key: string,
 *   action: () => void,
 *   ctrl?: boolean,
 *   alt?: boolean,
 *   shift?: boolean,
 *   label?: string,
 *   allowInInput?: boolean
 * }>} shortcuts
 */
export const useKeyboardShortcuts = (shortcuts) => {
  const { permissions } = useAuthStore();

  const handler = useCallback((event) => {
    const tag = event.target.tagName;
    const isEditable =
      tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || event.target.isContentEditable;

    for (const shortcut of shortcuts) {
      const keyMatch = event.key === shortcut.key ||
        event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (!keyMatch) continue;

      // Verificar permisos si el atajo requiere uno
      if (shortcut.permission && !permissions.includes(shortcut.permission)) {
        continue;
      }

      const needsCtrl = !!shortcut.ctrl;
      const needsAlt = !!shortcut.alt;
      const needsShift = !!shortcut.shift;
      const noModifiers = !needsCtrl && !needsAlt && !needsShift;


      // Verificar modificadores
      if (needsCtrl && !event.ctrlKey && !event.metaKey) continue;
      if (needsAlt && !event.altKey) continue;
      if (needsShift && !event.shiftKey) continue;

      // Si no tiene modificadores y el usuario está escribiendo, ignorar
      // a menos que sea una tecla funcional (F1-F12, Escape) o allowInInput
      if (noModifiers && isEditable && !shortcut.allowInInput) {
        const isFunctionKey = /^(F[1-9]|F1[0-2]|Escape)$/.test(shortcut.key);
        if (!isFunctionKey) continue;
      }

      event.preventDefault();
      event.stopPropagation();
      shortcut.action();
      return;
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handler, { capture: true });
    return () => window.removeEventListener('keydown', handler, { capture: true });
  }, [handler]);
};

/**
 * Tabla de atajos estándar de FarmaPro.
 * Se usa tanto para el mapeo como para la documentación en el panel de ayuda.
 *
 * Jerarquía de atajos:
 * ┌─────────────────────────────────────────────────┐
 * │ GLOBALES (siempre activos si autenticado)       │
 * │  Alt+D → Dashboard     Alt+P → POS             │
 * │  Alt+I → Inventario    Alt+C → Clientes         │
 * │  Alt+R → Reportes      Alt+O → Compras          │
 * │  /     → Enfocar búsqueda   ?  → Panel de ayuda │
 * ├─────────────────────────────────────────────────┤
 * │ MÓDULO: POS                                     │
 * │  F12   → Procesar Venta    Ctrl+S → Confirmar   │
 * │  Esc   → Cerrar modal                           │
 * ├─────────────────────────────────────────────────┤
 * │ MÓDULO: CRUD (Clientes, Proveedores, Inventario)│
 * │  Alt+N → Nuevo registro    Ctrl+S → Guardar     │
 * │  Esc   → Cancelar / cerrar                      │
 * ├─────────────────────────────────────────────────┤
 * │ MÓDULO: Compras                                 │
 * │  F12   → Procesar Compra   Esc → Cancelar       │
 * └─────────────────────────────────────────────────┘
 */
export const SHORTCUT_MAP = {
  // Navegación global
  NAV_DASHBOARD:   { key: 'd', alt: true, label: 'Ir al Dashboard' },
  NAV_POS:         { key: 'p', alt: true, label: 'Ir al Punto de Venta' },
  NAV_INVENTORY:   { key: 'i', alt: true, label: 'Ir a Inventario' },
  NAV_CLIENTS:     { key: 'c', alt: true, label: 'Ir a Clientes' },
  NAV_REPORTS:     { key: 'r', alt: true, label: 'Ir a Reportes' },
  NAV_COMPRAS:     { key: 'o', alt: true, label: 'Ir a Compras' },
  FOCUS_SEARCH:    { key: '/', label: 'Enfocar búsqueda' },
  SHOW_HELP:       { key: '?', shift: true, label: 'Mostrar atajos de teclado' },

  // POS
  PROCESS_SALE:    { key: 'F12', label: 'Procesar Venta [F12]' },
  CONFIRM_PAYMENT: { key: 's', ctrl: true, label: 'Confirmar Pago [Ctrl+S]' },

  // CRUD general
  NEW_RECORD:      { key: 'n', alt: true, label: 'Nuevo Registro [Alt+N]', permission: 'records.create' },
  SAVE_FORM:       { key: 's', ctrl: true, label: 'Guardar [Ctrl+S]', permission: 'records.save' },
  CANCEL:          { key: 'Escape', label: 'Cancelar / Cerrar [Esc]' },

  // Compras
  PROCESS_COMPRA:  { key: 'F12', label: 'Procesar Compra [F12]' },
};

/**
 * Formatea una tecla para mostrarse en tooltip/badge.
 * Ej: { key: 's', ctrl: true } → "Ctrl+S"
 */
export const formatShortcutLabel = (shortcut) => {
  const parts = [];
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.shift) parts.push('Shift');
  parts.push(shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key);
  return parts.join('+');
};
