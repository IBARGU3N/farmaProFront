import React from 'react';

// Presentational: decorative, consistent with app's UI
export default function PrinterOption({ printer, checked, onChange }) {
  const icon = printer.type === 'local' ? '💾' : '🌐';
  return (
    <div className="printer-card flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface/60 hover:bg-gray-50 dark:hover:bg-surface/80 hover:shadow-md transition-all transform mb-2">
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="printer"
          value={printer.id}
          checked={checked}
          onChange={() => onChange(printer.id)}
          className="cursor-pointer"
        />
        <span className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white" aria-label="printer-icon" title={printer.type}>
          {icon}
        </span>
        <div>
          <div className="font-semibold text-gray-800 dark:text-white">{printer.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{printer.type.toUpperCase()} • {printer.location || 'Sin ubicación'}</div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded-full text-xs ${printer.type === 'local' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {printer.type}
        </span>
      </div>
    </div>
  );
}
