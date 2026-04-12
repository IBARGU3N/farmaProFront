import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  total, 
  paymentMethod, 
  setPaymentMethod, 
  cashReceived, 
  setCashReceived, 
  change, 
  isLoading 
}) => {
  if (!isOpen) return null;

  const iconMap = {
    EFECTIVO: (
      <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    TARJETA: (
      <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    TRANSFERENCIA: (
      <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h3 className="text-2xl font-black text-[#473198] mb-6">Procesar Pago</h3>

        <div className="text-center mb-6">
          <p className="text-sm text-[#473198]/50">Total a pagar</p>
          <p className="text-4xl font-black text-[#473198]">${total.toLocaleString()}</p>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-sm font-bold text-[#473198]">Metodo de pago</p>
          <div className="grid grid-cols-3 gap-3">
            {['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-3 rounded-xl border-2 text-center font-bold text-sm transition-all ${
                  paymentMethod === method
                    ? 'border-[#473198] bg-[#473198] text-white'
                    : 'border-[#9BF3F0]/30 text-[#473198] hover:border-[#473198]/30'
                }`}
              >
                {iconMap[method]}
                {method}
              </button>
            ))}
          </div>
        </div>

        {paymentMethod === 'EFECTIVO' && (
          <div className="mb-6">
            <label className="text-sm font-bold text-[#473198] mb-2 block">Efectivo recibido</label>
            <input
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#9BF3F0]/30 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              placeholder="0"
            />
            {change >= 0 && cashReceived && (
              <p className="mt-2 text-sm font-bold text-green-600">Cambio: ${change.toLocaleString()}</p>
            )}
            {change < 0 && cashReceived && (
              <p className="mt-2 text-sm font-bold text-red-500">Falta: ${Math.abs(change).toLocaleString()}</p>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={paymentMethod === 'EFECTIVO' && change < 0}
          >
            Confirmar
          </Button>
        </div>
      </Card>
    </div>
  );
};
