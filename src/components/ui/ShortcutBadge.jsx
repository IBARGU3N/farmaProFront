/**
 * ShortcutBadge — Componente Dumb para mostrar la tecla de atajo
 * junto a un botón de acción.
 *
 * Solo recibe y renderiza; no gestiona lógica de eventos.
 *
 * Uso:
 *   <Button>
 *     Procesar Venta <ShortcutBadge keys="F12" variant="primary" />
 *   </Button>
 */
export const ShortcutBadge = ({ keys, variant = 'default', className = '' }) => {
  if (!keys) return null;

  const variants = {
    default: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600',
    primary: 'bg-white text-slate-900 border-slate-200 shadow-sm dark:bg-slate-100 dark:text-slate-900 dark:border-white',
    ghost: 'bg-primary/20 text-primary border-primary/50 dark:bg-primary/30 dark:text-primary-foreground dark:border-primary/60',
  };

  return (
    <kbd
      className={`
        ml-2 inline-flex items-center px-1.5 py-0.5
        text-[10px] font-mono font-bold uppercase tracking-wider
        border rounded-md
        shadow-[0_1px_0_0_rgba(0,0,0,0.1)]
        transition-all
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {keys}
    </kbd>
  );
};
