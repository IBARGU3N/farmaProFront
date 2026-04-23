import { useState } from 'react';
import { useCreateLot, useUpdateLot, useDeleteLot, useProductLots } from '../hooks/useInventory';
import { LotFormModal } from './LotFormModal';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { LotManager } from './LotManager';
import { ErrorModal } from '../../../components/ui/ErrorModal';
import toast from 'react-hot-toast';

export const LotManagerSmart = ({ productId }) => {
  const [showLotForm, setShowLotForm] = useState(false);
  const [showAdjustForm, setShowAdjustForm] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const [adjustingLot, setAdjustingLot] = useState(null);
  const [backendError, setBackendError] = useState(null);

  const { data: lotsData, isLoading } = useProductLots(productId);
  const lots = Array.isArray(lotsData?.data) ? lotsData.data : (Array.isArray(lotsData) ? lotsData : []);

  const createMutation = useCreateLot();
  const updateMutation = useUpdateLot();
  const deleteMutation = useDeleteLot();

  const handleCreateLot = (data) => {
    console.log('📦 LOG (Lote): Enviando a Service (CREATE):', data);
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Lote creado exitosamente');
        setShowLotForm(false);
      },
      onError: (err) => {
        const msg = err.response?.data?.message || 'Error al crear lote';
        setBackendError(msg);
      },
    });
  };

  const handleUpdateLot = (data) => {
    console.log('📦 LOG (Lote): Enviando a Service (UPDATE):', { id: editingLot.id, data });
    updateMutation.mutate({ id: editingLot.id, data }, {
      onSuccess: () => {
        toast.success('Lote actualizado exitosamente');
        setShowLotForm(false);
        setEditingLot(null);
      },
      onError: (err) => {
        const msg = err.response?.data?.message || 'Error al actualizar lote';
        setBackendError(msg);
      },
    });
  };

  const handleDeleteLot = (id) => {
    if (!window.confirm('¿Desea eliminar este lote?')) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Lote eliminado'),
      onError: (err) => toast.error(err.response?.data?.message || 'Error al eliminar lote'),
    });
  };

  const handleEditLot = (lot) => {
    setEditingLot(lot);
    setShowLotForm(true);
  };

  const handleAdjustStock = (lot) => {
    setAdjustingLot(lot);
    setShowAdjustForm(true);
  };

  const handleCloseForm = () => {
    setShowLotForm(false);
    setEditingLot(null);
  };

  return (
    <>
      <LotManager
        lots={lots}
        onAddLot={() => { setEditingLot(null); setShowLotForm(true); }}
        onEditLot={handleEditLot}
        onDeleteLot={handleDeleteLot}
        onAdjustStock={handleAdjustStock}
        isLoading={isLoading}
      />

      <LotFormModal
        isOpen={showLotForm}
        onClose={handleCloseForm}
        onSubmit={editingLot ? handleUpdateLot : handleCreateLot}
        initialData={editingLot}
        isLoading={createMutation.isPending || updateMutation.isPending}
        productId={productId}
      />

      <ErrorModal
        isOpen={!!backendError}
        errorMsg={backendError}
        onClose={() => setBackendError(null)}
      />

      <StockAdjustmentModal
        isOpen={showAdjustForm}
        onClose={() => { setShowAdjustForm(false); setAdjustingLot(null); }}
        lot={adjustingLot}
      />
    </>
  );
};
