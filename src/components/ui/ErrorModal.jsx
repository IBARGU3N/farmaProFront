import React, { useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ShortcutBadge } from './ShortcutBadge';

export const ErrorModal = ({ isOpen, errorMsg, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-surface border border-red-500/50 shadow-2xl overflow-hidden shadow-red-500/20">
        <div className="bg-red-500/10 border-b border-red-500/20 p-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-red-600 text-center">
            Error de Validación
          </h2>
        </div>
        <div className="p-6 text-center">
          <p className="text-on-surface mb-6 font-medium">
            {errorMsg || 'Ha ocurrido un error al procesar tu solicitud.'}
          </p>
          <div className="flex justify-center">
            <Button variant="primary" onClick={onClose} className="w-full justify-center bg-red-600 hover:bg-red-700 text-white border-none">
              Aceptar <ShortcutBadge keys="Esc" className="ml-2 bg-red-800 text-red-100 border-red-700" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
