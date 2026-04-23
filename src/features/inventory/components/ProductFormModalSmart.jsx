import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ProductFormModal } from './ProductFormModal';
import { useCreateProduct, useUpdateProduct, useLaboratorios } from '../hooks/useInventory';
import { ErrorModal } from '../../../components/ui/ErrorModal';
import toast from 'react-hot-toast';

export const ProductFormModalSmart = ({ isOpen, onClose, editingProduct }) => {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [backendError, setBackendError] = useState(null);

  const { data: labsData } = useLaboratorios();
  const rawData = labsData?.data;
  const laboratories = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const handleSubmit = async (formData) => {
    setShowConfirm(true);
    setPendingAction(formData);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);

    try {
      console.log('📦 LOG (Producto): Enviando a Service:', pendingAction);
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, data: pendingAction });
        toast.success('Producto actualizado exitosamente');
      } else {
        await createMutation.mutateAsync(pendingAction);
        toast.success('Producto creado exitosamente');
      }
      onClose(); // Solo se cierra el form de Producto tras éxito!
      setPendingAction(null);
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al guardar el producto';
      setBackendError(msg);
      // Data is NOT cleared and modal remains open
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setPendingAction(null);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <ProductFormModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        initialData={editingProduct}
        isLoading={isLoading}
        laboratories={laboratories}
      />

      <ErrorModal
        isOpen={!!backendError}
        errorMsg={backendError}
        onClose={() => setBackendError(null)}
      />

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl shadow-2xl border border-surface-container-low/30 p-8 max-w-sm w-full text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-primary mb-2">Confirmar acción</h3>
            <p className="text-sm text-primary/60 mb-6">
              ¿Desea {editingProduct ? 'actualizar' : 'crear'} este producto?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2 border-2 border-surface-container-low/30 text-primary rounded-xl font-bold hover:bg-surface-container-low/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-on-surface transition-colors"
                disabled={isLoading}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
