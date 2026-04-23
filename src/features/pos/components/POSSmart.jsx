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
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import { ShortcutBadge } from '../../../components/ui/ShortcutBadge';
import toast from 'react-hot-toast';

const POSSmart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { items, addItem, removeItem, updateQuantity, clearCart, client, setClient, discount, setDiscount, getTotal, getItemCount, getSubtotal } = useCartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSwitchCajaModal, setShowSwitchCajaModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
  const [cashReceived, setCashReceived] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [selectedCajaId, setSelectedCajaId] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);
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

  const switchRegisterMutation = useMutation({
    mutationFn: (data) => posService.switchCashRegister(data),
    onSuccess: () => {
      toast.success('Caja cambiada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['cash-register-status'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al cambiar caja');
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

  const initiateMPMutation = useMutation({
    mutationFn: (saleData) => posService.initiateMercadoPago(saleData),
    onSuccess: (response) => {
      const { init_point } = response.data.preference;
      window.location.href = init_point;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al iniciar pago con Mercado Pago');
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
    console.log('POSSmart: handleProcessSale triggered');
    console.log('POSSmart: Cart items length:', items.length);
    if (items.length === 0) {
      console.warn('POSSmart: Cart is empty, modal not opened');
      toast.error('El carrito está vacío. Agregue productos antes de procesar.');
      return;
    }
    console.log('POSSmart: Opening payment modal...');
    toast('Abriendo modal de pago...', { icon: '💳', duration: 1200 });
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
      metodo_pago: paymentMethod || 'EFECTIVO',
      usuario_id: user?.id,
      is_test: true,
    };

    toast.loading('Procesando venta...', { id: 'sale-processing' });
    processSaleMutation.mutate(saleData, {
      onSettled: () => toast.dismiss('sale-processing'),
    });
  };

  useKeyboardShortcuts([
    {
      key: 'F12',
      action: handleProcessSale,
      label: 'Procesar Venta',
    },
    {
      key: 's',
      ctrl: true,
      action: () => {
        if (showPaymentModal) {
          handleConfirmPayment();
        }
      },
      label: 'Confirmar pago',
    },
    {
      key: 'Escape',
      action: () => {
        if (showPaymentModal) {
          setShowPaymentModal(false);
          toast('Pago cancelado', { icon: '✖️', duration: 1200 });
        } else if (showSwitchCajaModal) {
          setShowSwitchCajaModal(false);
        }
      },
      label: 'Cerrar modal',
    },
    {
      key: '/',
      action: () => searchInputRef.current?.focus(),
      label: 'Enfocar búsqueda',
    },
  ]);

  const handleOpenRegister = () => {
    if (!selectedCajaId) {
      toast.error('Seleccione una caja');
      return;
    }
    openRegisterMutation.mutate({ caja_id: selectedCajaId });
  };

  const handleSwitchCaja = () => {
    if (!selectedCajaId) {
      toast.error('Seleccione una caja');
      return;
    }
    switchRegisterMutation.mutate({ caja_id: selectedCajaId });
    setShowSwitchCajaModal(false);
  };

  const change = paymentMethod === 'EFECTIVO' ? parseFloat(cashReceived || 0) - getTotal() : 0;

  if (!isOpen) {
    return (
      <div className="p-6 bg-surface-container-low/20 min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md w-full">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-primary mb-2">Caja Cerrada</h2>
          <p className="text-primary/60 mb-6">Debe abrir una caja antes de procesar ventas</p>
           <div className="space-y-4">
             <p className="text-sm font-bold text-primary">Seleccione una caja para abrir</p>
             <CajaSelector
               cajas={cajasData?.data || []}
               selectedCajaId={selectedCajaId}
               onSelectCaja={setSelectedCajaId}
             />
             <Button
               variant="primary"
               size="large"
               onClick={handleOpenRegister}
               isLoading={openRegisterMutation.isPending}
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
    <>
      <div className="p-6 bg-surface-container-low/20 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           <div className="relative">
             <input
               ref={searchInputRef}
               type="text"
               placeholder="Buscar producto por nombre o codigo de barras..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full px-6 py-4 border-2 border-primary-container/30 rounded-2xl bg-surface/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-lg font-medium"
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
               <ShortcutBadge keys="/" />
             </div>
             {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-secondary/30 overflow-hidden max-h-80 overflow-y-auto">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface-container-low/50 dark:bg-surface-container-lowest/50 transition-colors text-left border-b border-primary-container/10 last:border-0"
                  >
                    <div>
                      <p className="font-bold text-primary">{product.nombre}</p>
                      <p className="text-xs text-primary/50">{product.codigo_barras}</p>
                    </div>
                    <span className="font-black text-primary">${product.precio_venta?.toLocaleString() || 0}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

           <div className="grid grid-cols-3 gap-4">
             <Card className="p-4 text-center relative group">
               <p className="text-xs text-primary/50 font-bold uppercase">Caja</p>
               <p className="text-sm font-black text-primary">{cashRegisterStatus?.data?.caja?.nombre || '—'}</p>
               <button 
                 onClick={() => setShowSwitchCajaModal(true)}
                 className="absolute top-2 right-2 p-1 bg-surface-container-low dark:bg-surface-container-lowest text-primary rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
                 title="Cambiar Caja"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                 </svg>
               </button>
             </Card>
             <Card className="p-4 text-center">
               <p className="text-xs text-primary/50 font-bold uppercase">Ventas Hoy</p>
               <p className="text-sm font-black text-primary">{cashRegisterStatus?.data?.today_stats?.total_ventas || 0}</p>
             </Card>
             <Card className="p-4 text-center">
               <p className="text-xs text-primary/50 font-bold uppercase">Balance</p>
               <p className="text-sm font-black text-primary">
                 ${Number(cashRegisterStatus?.data?.today_stats?.balance || 0).toLocaleString()}
               </p>
             </Card>
           </div>
         </div>

         <div className="lg:col-span-1">
           <Card className="p-6 sticky top-6">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-black text-primary">Carrito</h3>
               <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                 {getItemCount()} items
               </span>
             </div>

             <div className="mb-4">
               {client ? (
                 <div className="flex items-center justify-between p-3 bg-surface-container-low/50 dark:bg-surface-container-lowest/50 rounded-xl">
                   <div>
                     <p className="text-sm font-bold text-primary">{client.razon_social_o_nombre}</p>
                     <p className="text-xs text-primary/50">{client.numero_documento}</p>
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
                   className="w-full p-3 border-2 border-dashed border-secondary/30 rounded-xl text-sm text-primary/50 hover:border-primary/30 hover:text-primary transition-colors"
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
                       className="w-full text-left p-2 hover:bg-surface-container-low/50 dark:bg-surface-container-lowest/50 rounded-lg text-sm"
                     >
                       {c.razon_social_o_nombre}
                     </button>
                   ))}
                 </div>
               )}
             </div>

             <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
               {items.length === 0 ? (
                 <p className="text-center text-primary/40 text-sm py-8">Carrito vacío</p>
               ) : (
                 items.map((item) => (
                   <div key={item.producto_id} className="flex items-center justify-between p-3 bg-surface-container-low/30 rounded-xl">
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-primary truncate">{item.nombre}</p>
                       <p className="text-xs text-primary/50">${item.precio.toLocaleString()} c/u</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <button
                         onClick={() => updateQuantity(item.producto_id, item.quantity - 1)}
                         className="w-7 h-7 rounded-full bg-white border border-secondary/30 flex items-center justify-center text-primary font-bold hover:bg-secondary/20"
                       >
                         −
                       </button>
                       <span className="text-sm font-bold text-primary w-6 text-center">{item.quantity}</span>
                       <button
                         onClick={() => updateQuantity(item.producto_id, item.quantity + 1)}
                         className="w-7 h-7 rounded-full bg-white border border-secondary/30 flex items-center justify-center text-primary font-bold hover:bg-secondary/20"
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

                <div className="border-t border-primary-container/20 pt-4 space-y-2">

                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-bold text-primary">${getSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Descuento</span>
                  <span className="font-bold text-error">-${discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-primary pt-2 border-t border-primary-container/20">
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
                   disabled={items.length === 0 || processSaleMutation.isPending}
                   isLoading={processSaleMutation.isPending}
                   title="Presiona F12 para procesar"
                 >
                   Procesar Venta <ShortcutBadge keys="F12" />
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
  </div>

    {showSwitchCajaModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <h3 className="text-2xl font-black text-primary mb-6">Cambiar de Caja</h3>
          <div className="space-y-4 mb-6">
            <p className="text-sm font-bold text-primary">Seleccione la caja a la que desea cambiar</p>
            <CajaSelector
              cajas={cajasData?.data || []}
              selectedCajaId={selectedCajaId}
              onSelectCaja={setSelectedCajaId}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowSwitchCajaModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSwitchCaja}
              isLoading={switchRegisterMutation.isPending}
              disabled={!selectedCajaId}
            >
              Confirmar Cambio
            </Button>
          </div>
        </Card>
      </div>
    )}

    <PaymentModal
      isOpen={showPaymentModal}
      onClose={() => setShowPaymentModal(false)}
      onConfirm={handleConfirmPayment}
      total={getTotal()}
      items={items}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      cashReceived={cashReceived}
      setCashReceived={setCashReceived}
      change={Math.max(0, parseFloat(cashReceived) - getTotal())}
      isLoading={processSaleMutation.isPending || initiateMPMutation.isPending}
    />
  </>
  );
};

export default POSSmart;
