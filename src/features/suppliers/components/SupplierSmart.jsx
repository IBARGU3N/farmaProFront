import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierService } from '../../../services/supplier/supplierService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';

const SupplierSmart = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    tipo_documento: '',
    numero_documento: '',
    razon_social_o_nombre: '',
    email: '',
    telefono: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => supplierService.create(data),
    onSuccess: () => {
      toast.success('Proveedor creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setShowForm(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al crear proveedor');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => supplierService.update(id, data),
    onSuccess: () => {
      toast.success('Proveedor actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setShowForm(false);
      setEditingSupplier(null);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar proveedor');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => supplierService.delete(id),
    onSuccess: () => {
      toast.success('Proveedor eliminado');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: () => toast.error('Error al eliminar proveedor'),
  });

  const resetForm = () => {
    setFormData({ tipo_documento: '', numero_documento: '', razon_social_o_nombre: '', email: '', telefono: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSupplier) {
      updateMutation.mutate({ id: editingSupplier.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      tipo_documento: supplier.tipo_documento || '',
      numero_documento: supplier.numero_documento || '',
      razon_social_o_nombre: supplier.razon_social_o_nombre || '',
      email: supplier.email || '',
      telefono: supplier.telefono || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id, nombre) => {
    if (!window.confirm(`Esta seguro de eliminar a "${nombre}"?`)) return;
    deleteMutation.mutate(id);
  };

  const suppliers = data?.data?.data || data?.data || [];

  return (
    <div className="p-6 bg-surface/20 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary">Proveedores</h1>
          <p className="text-primary/60 mt-1">Gestion de proveedores</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingSupplier(null); resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancelar' : '+ Nuevo Proveedor'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold text-primary mb-4">{editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-bold text-primary mb-1">Tipo Documento</label>

              <select
                value={formData.tipo_documento}
                onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value })}
                 className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"

              >
                <option value="">Seleccionar</option>
                <option value="NIT">NIT</option>
                <option value="CC">Cedula</option>
                <option value="CE">Cedula de Extranjeria</option>
              </select>
            </div>
            <div>
               <label className="block text-sm font-bold text-primary mb-1">Numero Documento *</label>

              <input
                type="text"
                required
                value={formData.numero_documento}
                onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                 className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"

              />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-primary mb-1">Razon Social *</label>

              <input
                type="text"
                required
                value={formData.razon_social_o_nombre}
                onChange={(e) => setFormData({ ...formData, razon_social_o_nombre: e.target.value })}
                 className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"

              />
            </div>
            <div>
               <label className="block text-sm font-bold text-primary mb-1">Email</label>

              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"

              />
            </div>
            <div>
               <label className="block text-sm font-bold text-primary mb-1">Telefono</label>

              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                 className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"

              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" variant="primary" isLoading={createMutation.isLoading || updateMutation.isLoading}>
                {editingSupplier ? 'Actualizar Proveedor' : 'Crear Proveedor'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
           <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>

        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                 <tr className="text-left text-xs font-bold text-primary/50 uppercase tracking-wider bg-surface/30 border-b border-secondary/20">

                  <th className="px-6 py-4">Razon Social</th>
                  <th className="px-6 py-4">NIT/Documento</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Telefono</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
               <tbody className="divide-y divide-secondary/10">

                {suppliers.length > 0 ? suppliers.map((s) => (
                   <tr key={s.id} className="hover:bg-surface/30 transition-colors">

                     <td className="px-6 py-4 font-bold text-primary">{s.razon_social_o_nombre}</td>

                     <td className="px-6 py-4 text-sm text-primary/60">{s.numero_documento}</td>

                     <td className="px-6 py-4 text-sm text-primary/60">{s.email || '—'}</td>

                     <td className="px-6 py-4 text-sm text-primary/60">{s.telefono || '—'}</td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                           className="p-1.5 text-primary/50 hover:text-primary transition-colors"

                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.razon_social_o_nombre)}
                          className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                     <td colSpan="5" className="px-6 py-12 text-center text-primary/40">

                      No se encontraron proveedores
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SupplierSmart;
