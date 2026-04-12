import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { posService } from '../../../services/pos/posService';
import { productService } from '../../../services/inventory/inventoryService';
import { clientService } from '../../../services/client/clientService';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { CajaSelector } from './CajaSelector';
import { PaymentModal } from './PaymentModal';
import toast from 'react-hot-toast';

const POSSmart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { items, addItem, removeItem, updateQuantity, clearCart, client, setClient, discount, setDiscount, getTotal, getItemCount, getSubtotal } = useCartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
  const [cashReceived, setCashReceived] = useState('');
  const [selectedCajaId, setSelectedCajaId] = useState('');
  const searchInputRef = useRef(null);

  const { data: cashRegisterStatus } = useQuery({
    queryKey: ['cash-register-status'],
    queryFn: () => posService.getCashRegisterStatus(),
    refetchInterval: 30000,
  });

  const { data: cajasData } = useQuery({
    queryKey: ['cajas-list'],
    queryFn: () => posService.getCashRegisters(),
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getAll(),
    enabled: showClientSearch,
  });

  const openRegisterMutation = useMutation({
    mutationFn: (data) => posService.openCashRegister(data),
    onSuccess: () => {
      toast.success('Caja abierta exitosamente');
      queryClient.invalidateQueries({ queryKey: ['cash-register-status'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al abrir caja');
    },
  });

  const processSaleMutation = useMutation({
    mutationFn: (saleData) => posService.processSale(saleData),
    onSuccess: (response) => {
      toast.success(`Venta procesada: ${response.data.numero_documento}`);
      clearCart();
      setShowPaymentModal(false);
      setCashReceived('');
      queryClient.invalidateQueries({ queryKey: ['cash-register-status'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al procesar la venta');
    },
  });

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timer = setTimeout(async () => {
        try {
          const res = await productService.search(searchQuery);
          setSearchResults(res.data || []);
        } catch (e) {
          setSearchResults([]);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const isOpen = cashRegisterStatus?.data?.status === 'open';

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleAddToCart = (product) => {
    addItem({ id: product.id, nombre: product.nombre, precio_venta: product.precio_venta || 0 });
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const handleProcessSale = () => {
    if (items.length === 0) {
      toast.error('El carrito esta vacio');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    const saleData = {
      items: items.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.quantity,
        descuento: item.descuento || 0,
      })),
      tercero_id: client?.id || null,
      descuento: discount,
      metodo_pago: paymentMethod,
      usuario_id: user?.id,
    };
    processSaleMutation.mutate(saleData);
  };

  const handleOpenRegister = () => {
    if (!selectedCajaId) {
      toast.error('Seleccione una caja');
      return;
    }
    openRegisterMutation.mutate({ caja_id: selectedCajaId });
  };

  const change = paymentMethod === 'EFECTIVO' ? parseFloat(cashReceived || 0) - getTotal() : 0;

  if (!isOpen) {
    return (
      <div className="p-6 bg-[#DAFFED]/20 min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md w-full">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-[#473198]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#473198] mb-2">Caja Cerrada</h2>
          <p className="text-[#473198]/60 mb-6">Debe abrir una caja antes de procesar ventas</p>
           <div className="space-y-4">
             <p className="text-sm font-bold text-[#473198]">Seleccione una caja para abrir</p>
             <CajaSelector
               cajas={cajasData?.data || []}
               selectedCajaId={selectedCajaId}
               onSelectCaja={setSelectedCajaId}
             />
             <Button
               variant="primary"
               size="large"
               onClick={handleOpenRegister}
               isLoading={openRegisterMutation.isLoading}
               disabled={!selectedCajaId}
             >
               Abrir Caja
             </Button>
           </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#DAFFED]/20 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar producto por nombre o codigo de barras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 border-2 border-[#9BF3F0]/30 rounded-2xl bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#473198]/20 focus:border-[#473198]/40 text-lg font-medium"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#9BF3F0]/30 overflow-hidden max-h-80 overflow-y-auto">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#DAFFED]/50 transition-colors text-left border-b border-[#9BF3F0]/10 last:border-0"
                  >
                    <div>
                      <p className="font-bold text-[#473198]">{product.nombre}</p>
                      <p className="text-xs text-[#473198]/50">{product.codigo_barras}</p>
                    </div>
                    <span className="font-black text-[#473198]">${product.precio_venta?.toLocaleString() || 0}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <p className="text-xs text-[#473198]/50 font-bold uppercase">Caja</p>
              <p className="text-sm font-black text-[#473198]">{cashRegisterStatus?.data?.caja?.nombre || '—'}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xs text-[#473198]/50 font-bold uppercase">Ventas Hoy</p>
              <p className="text-sm font-black text-[#473198]">{cashRegisterStatus?.data?.today_stats?.total_ventas || 0}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xs text-[#473198]/50 font-bold uppercase">Balance</p>
              <p className="text-sm font-black text-[#473198]">
                ${Number(cashRegisterStatus?.data?.today_stats?.balance || 0).toLocaleString()}
              </p>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#473198]">Carrito</h3>
              <span className="px-3 py-1 bg-[#473198] text-white text-xs font-bold rounded-full">
                {getItemCount()} items
              </span>
            </div>

            <div className="mb-4">
              {client ? (
                <div className="flex items-center justify-between p-3 bg-[#DAFFED]/50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-[#473198]">{client.razon_social_o_nombre}</p>
                    <p className="text-xs text-[#473198]/50">{client.numero_documento}</p>
                  </div>
                  <button onClick={() => setClient(null)} className="text-red-500 text-sm font-bold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClientSearch(!showClientSearch)}
                  className="w-full p-3 border-2 border-dashed border-[#9BF3F0]/30 rounded-xl text-sm text-[#473198]/50 hover:border-[#473198]/30 hover:text-[#473198] transition-colors"
                >
                  + Seleccionar Cliente
                </button>
              )}
              {showClientSearch && clientsData?.data?.data && (
                <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                  {clientsData.data.data.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setClient(c); setShowClientSearch(false); }}
                      className="w-full text-left p-2 hover:bg-[#DAFFED]/50 rounded-lg text-sm"
                    >
                      {c.razon_social_o_nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.length === 0 ? (
                <p className="text-center text-[#473198]/40 text-sm py-8">Carrito vacio</p>
              ) : (
                items.map((item) => (
                  <div key={item.producto_id} className="flex items-center justify-between p-3 bg-[#DAFFED]/30 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#473198] truncate">{item.nombre}</p>
                      <p className="text-xs text-[#473198]/50">${item.precio.toLocaleString()} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.producto_id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white border border-[#9BF3F0]/30 flex items-center justify-center text-[#473198] font-bold hover:bg-[#9BF3F0]/20"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold text-[#473198] w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.producto_id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-white border border-[#9BF3F0]/30 flex items-center justify-center text-[#473198] font-bold hover:bg-[#9BF3F0]/20"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.producto_id)}
                        className="ml-2 text-red-400 hover:text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[#9BF3F0]/20 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#473198]/60">Subtotal</span>
                <span className="font-bold text-[#473198]">${getSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#473198]/60">Descuento</span>
                <span className="font-bold text-red-500">-${discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-[#473198] pt-2 border-t border-[#9BF3F0]/20">
                <span>Total</span>
                <span>${getTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                variant="primary"
                size="large"
                className="w-full"
                onClick={handleProcessSale}
                disabled={items.length === 0 || processSaleMutation.isLoading}
                isLoading={processSaleMutation.isLoading}
              >
                Procesar Venta
              </Button>
              <Button
                variant="outline"
                size="small"
                className="w-full"
                onClick={clearCart}
                disabled={items.length === 0}
              >
                Limpiar Carrito
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8">
            <h3 className="text-2xl font-black text-[#473198] mb-6">Procesar Pago</h3>

            <div className="text-center mb-6">
              <p className="text-sm text-[#473198]/50">Total a pagar</p>
              <p className="text-4xl font-black text-[#473198]">${getTotal().toLocaleString()}</p>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-sm font-bold text-[#473198]">Metodo de pago</p>
              <div className="grid grid-cols-3 gap-3">
                {['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'].map((method) => {
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
                  );
                })}
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
              <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleConfirmPayment}
                isLoading={processSaleMutation.isLoading}
                disabled={paymentMethod === 'EFECTIVO' && change < 0}
              >
                Confirmar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default POSSmart;
