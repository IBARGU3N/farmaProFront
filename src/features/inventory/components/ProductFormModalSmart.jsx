import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ProductFormModal } from './ProductFormModal';
import { useCreateProduct, useUpdateProduct, useLaboratorios } from '../hooks/useInventory';
import toast from 'react-hot-toast';

export const ProductFormModalSmart = ({ isOpen, onClose, editingProduct }) => {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const { data: labsData } = useLaboratorios();
  const laboratories = labsData?.data || [];

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const handleSubmit = async (formData) => {
    setShowConfirm(true);
    setPendingAction(formData);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);

    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, data: pendingAction });
        toast.success('Producto actualizado exitosamente');
      } else {
        await createMutation.mutateAsync(pendingAction);
        toast.success('Producto creado exitosamente');
      }
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al guardar el producto';
      toast.error(msg);
    }
    setPendingAction(null);
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setPendingAction(null);
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

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

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-[#473198]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-[#473198] mb-2">Confirmar accion</h3>
            <p className="text-sm text-[#473198]/60 mb-6">
              {editingProduct ? 'Desea actualizar este producto?' : 'Desea crear este producto?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2 border-2 border-[#9BF3F0]/30 text-[#473198] rounded-xl font-bold hover:bg-[#9BF3F0]/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-[#473198] text-white rounded-xl font-bold hover:bg-[#4A0D67] transition-colors"
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
