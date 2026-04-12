import { useState } from 'react';
import { useCreateLot, useUpdateLot, useDeleteLot, useProductLots } from '../hooks/useInventory';
import { LotFormModal } from './LotFormModal';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { LotManager } from './LotManager';
import toast from 'react-hot-toast';

export const LotManagerSmart = ({ productId }) => {
  const [showLotForm, setShowLotForm] = useState(false);
  const [showAdjustForm, setShowAdjustForm] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const [adjustingLot, setAdjustingLot] = useState(null);

  const { data: lotsData, isLoading } = useProductLots(productId);
  const lots = Array.isArray(lotsData?.data) ? lotsData.data : (Array.isArray(lotsData) ? lotsData : []);

  const createMutation = useCreateLot();
  const updateMutation = useUpdateLot();
  const deleteMutation = useDeleteLot();

  const handleCreateLot = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Lote creado exitosamente');
        setShowLotForm(false);
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Error al crear lote'),
    });
  };

  const handleUpdateLot = (data) => {
    updateMutation.mutate({ id: editingLot.id, data }, {
      onSuccess: () => {
        toast.success('Lote actualizado exitosamente');
        setShowLotForm(false);
        setEditingLot(null);
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Error al actualizar lote'),
    });
  };

  const handleDeleteLot = (id) => {
    if (!window.confirm('Esta seguro de eliminar este lote?')) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Lote eliminado'),
      onError: () => toast.error('Error al eliminar lote'),
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

      <StockAdjustmentModal
        isOpen={showAdjustForm}
        onClose={() => { setShowAdjustForm(false); setAdjustingLot(null); }}
        lot={adjustingLot}
      />
    </>
  );
};
