import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ShortcutBadge } from '../../../components/ui/ShortcutBadge';
import toast from 'react-hot-toast';
import ResolutionsTable from './ResolutionsTable';
import ResolutionForm from './ResolutionForm';


const ResolutionsSmart = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingResolution, setEditingResolution] = useState(null);

  const { data: resolutionsData, isLoading } = useQuery({
    queryKey: ['document-resolutions'],
    queryFn: async () => {
      const res = await api.get('/pos/resolutions');
      return res.data?.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/pos/resolutions', data),
    onSuccess: () => {
      toast.success('Resolución creada correctamente');
      queryClient.invalidateQueries({ queryKey: ['document-resolutions'] });
      setShowForm(false);
      setEditingResolution(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Error al crear resolución');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/pos/resolutions/${id}`, data),
    onSuccess: () => {
      toast.success('Resolución actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['document-resolutions'] });
      setShowForm(false);
      setEditingResolution(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Error al actualizar resolución');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/pos/resolutions/${id}`),
    onSuccess: () => {
      toast.success('Resolución eliminada');
      queryClient.invalidateQueries({ queryKey: ['document-resolutions'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Error al eliminar resolución');
    },
  });

  const handleEdit = (resolution) => {
    setEditingResolution(resolution);
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-surface-container-low/20 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary">Resoluciones Documentales</h1>
          <p className="text-primary/60 mt-1">Gestión de rangos de folios para facturación</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => { setEditingResolution(null); setShowForm(!showForm); }}
          title="Nueva Resolución [Alt+N]"
        >
          {showForm ? 'Cancelar' : <><span>+ Nueva Resolución</span> <ShortcutBadge keys="Alt+N" /></>}
        </Button>
      </div>

      {showForm && (
        <ResolutionForm 
          initialData={editingResolution}
          onSubmit={(data) => editingResolution 
            ? updateMutation.mutate({ id: editingResolution.id, data })
            : createMutation.mutate(data)}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onCancel={() => { setShowForm(false); setEditingResolution(null); }}
        />
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <ResolutionsTable 
          resolutions={resolutionsData || []} 
          onEdit={handleEdit} 
          onDelete={(id) => {
            if (window.confirm('¿Está seguro de eliminar esta resolución?')) {
              deleteMutation.mutate(id);
            }
          }}
        />
      )}
    </div>
  );
};

export default ResolutionsSmart;
