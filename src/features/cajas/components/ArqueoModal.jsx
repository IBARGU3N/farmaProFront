import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { ShortcutBadge } from '../../../components/ui/ShortcutBadge';
import { X, DollarSign } from 'lucide-react';

export const ArqueoModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="p-6 relative max-w-md w-full mx-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
          title="Cerrar (Esc)"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <DollarSign size={24} />
          </div>
          <h2 className="text-xl font-black text-primary">Arqueo / Cierre de Caja</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Monto Final en Caja ($)</label>
            <TextInput
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              autoFocus
              required
            />
          </div>

          <div className="bg-surface-container-low/30 p-4 rounded-xl text-sm text-primary/60 italic">
            Asegúrese de que el monto ingresado coincida con el efectivo físico y los comprobantes de pago.
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancelar <ShortcutBadge keys="Esc" className="ml-2" />
            </Button>
            <Button 
              variant="primary" 
              onClick={() => onConfirm(amount)} 
              isLoading={isLoading}
              type="button"
            >
              Confirmar Cierre <ShortcutBadge keys="Ctrl+S" className="ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Adding ShortcutBadge import because I used it in the code
// Wait, I need to make sure I import it. I will fix it in the actual write.
