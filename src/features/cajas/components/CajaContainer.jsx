import React, { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { CajaTable } from './CajaTable';
import { CajaForm } from './CajaForm';
import { ArqueoModal } from './ArqueoModal';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import { ErrorModal } from '../../../components/ui/ErrorModal';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';

export const CajaContainer = () => {
  const queryClient = useQueryClient();
  const formRef = useRef(null);
  const { user } = useAuthStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showArqueoModal, setShowArqueoModal] = useState(false);
  const [editingCaja, setEditingCaja] = useState(null);

  // Queries
  const { data: queryData, isLoading: isListLoading } = useQuery({
    queryKey: ['cajas'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/cajas');
        console.log('📦 LOG (Caja): Respuesta API /cajas:', data);
        return data;
      } catch (error) {
        console.error('❌ LOG (Caja): Error cargando cajas:', error);
        throw error;
      }
    }
  });

  // Safe data mapping to prevent Error Boundary crash
  const cajas = useMemo(() => {
    if (!queryData) return [];
    return queryData.data?.data || queryData.data || (Array.isArray(queryData) ? queryData : []);
  }, [queryData]);

  const [backendError, setBackendError] = useState(null);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newCaja) => {
      console.log('📦 LOG (Caja): Enviando a Service (CREATE):', newCaja);
      return api.post('/cajas', newCaja);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
      toast.success('Caja creada correctamente');
      handleCloseForm();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al crear la caja';
      setBackendError(msg);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => {
      console.log('📦 LOG (Caja): Enviando a Service (UPDATE):', { id, ...data });
      return api.put(`/cajas/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
      toast.success('Caja actualizada correctamente');
      handleCloseForm();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al actualizar la caja';
      setBackendError(msg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/cajas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
      toast.success('Caja eliminada');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al eliminar la caja';
      toast.error(`❌ Error en Caja: ${msg}`);
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (caja) => {
      const endpoint = caja.estado === 'ABIERTA' ? 'close' : 'open';
      return api.post(`/cajas/${caja.id}/${endpoint}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
      toast.success('Estado de caja actualizado');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error al cambiar estado de la caja';
      toast.error(`❌ Error en Caja: ${msg}`);
    }
  });

  // Handlers
  const handleOpenNewForm = () => {
    if (!user) {
      toast.error('Sesión no válida. Por favor, inicie sesión nuevamente.');
      return;
    }
    setEditingCaja(null);
    setIsFormOpen(true);
  };

  const handleEdit = (caja) => {
    if (!caja) return;
    setEditingCaja(caja);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCaja(null);
  };

  const handleSubmit = (formData) => {
    console.log('📦 LOG (Caja): Iniciando Submit:', formData);
    if (editingCaja) {
      updateMutation.mutate({ id: editingCaja.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta caja?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleArqueoConfirm = async (amount) => {
    try {
      await api.post('/cajas/arqueo', { amount });
      toast.success('Caja cerrada y arqueada correctamente');
      setShowArqueoModal(false);
      queryClient.invalidateQueries({ queryKey: ['cajas'] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al realizar el arqueo');
    }
  };

  // Keyboard Shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      alt: true,
      action: handleOpenNewForm,
      label: 'Nuevo registro',
    },
    {
      key: 's',
      ctrl: true,
      action: () => {
        if (isFormOpen && formRef.current) {
          formRef.current.requestSubmit();
        }
      },
      label: 'Guardar formulario',
    },
    {
      key: 'Escape',
      action: handleCloseForm,
      label: 'Cerrar formulario',
    },
    {
      key: 'F2',
      action: () => setShowArqueoModal(true),
      label: 'Arqueo de caja',
    },
  ]);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
          <CajaTable
            cajas={cajas}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={toggleStatusMutation.mutate}
            onAddNew={handleOpenNewForm}
            onArqueo={() => setShowArqueoModal(true)}
          />

         {isFormOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <CajaForm
               ref={formRef}
               initialData={editingCaja}
               onSubmit={handleSubmit}
               onCancel={handleCloseForm}
               isLoading={createMutation.isPending || updateMutation.isPending}
             />
           </div>
         )}

         <ArqueoModal
           isOpen={showArqueoModal}
           onClose={() => setShowArqueoModal(false)}
           onConfirm={handleArqueoConfirm}
           isLoading={false}
         />

         <ErrorModal
           isOpen={!!backendError}
           errorMsg={backendError}
           onClose={() => setBackendError(null)}
         />
       </div>
    </ErrorBoundary>
  );
};
