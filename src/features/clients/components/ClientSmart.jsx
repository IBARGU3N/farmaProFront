import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '../../../services/client/clientService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';

const ClientSmart = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    tipo_documento: '',
    numero_documento: '',
    razon_social_o_nombre: '',
    email: '',
    telefono: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getAll(),
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['client-purchases', selectedClient?.id],
    queryFn: () => clientService.getPurchaseHistory(selectedClient.id),
    enabled: !!selectedClient && showHistory,
  });

  const createMutation = useMutation({
    mutationFn: (data) => clientService.create(data),
    onSuccess: () => {
      toast.success('Cliente creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowForm(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al crear cliente');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => clientService.update(id, data),
    onSuccess: () => {
      toast.success('Cliente actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowForm(false);
      setEditingClient(null);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar cliente');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => clientService.delete(id),
    onSuccess: () => {
      toast.success('Cliente eliminado');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: () => toast.error('Error al eliminar cliente'),
  });

  const resetForm = () => {
    setFormData({ tipo_documento: '', numero_documento: '', razon_social_o_nombre: '', email: '', telefono: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      tipo_documento: client.tipo_documento || '',
      numero_documento: client.numero_documento || '',
      razon_social_o_nombre: client.razon_social_o_nombre || '',
      email: client.email || '',
      telefono: client.telefono || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id, nombre) => {
    if (!window.confirm(`Esta seguro de eliminar a "${nombre}"?`)) return;
    deleteMutation.mutate(id);
  };

  const handleViewHistory = (client) => {
    setSelectedClient(client);
    setShowHistory(true);
  };

  const clients = data?.data?.data || data?.data || [];
  const purchases = historyData?.data || [];

  return (
    <div className="p-6 bg-[#DAFFED]/20 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#473198]">Clientes</h1>
          <p className="text-[#473198]/60 mt-1">Gestion de clientes</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingClient(null); resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancelar' : '+ Nuevo Cliente'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold text-[#473198] mb-4">{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Tipo Documento</label>
              <select
                value={formData.tipo_documento}
                onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              >
                <option value="">Seleccionar</option>
                <option value="CC">Cedula de Ciudadania</option>
                <option value="CE">Cedula de Extranjeria</option>
                <option value="NIT">NIT</option>
                <option value="TI">Tarjeta de Identidad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Numero Documento *</label>
              <input
                type="text"
                required
                value={formData.numero_documento}
                onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#473198] mb-1">Nombre / Razon Social *</label>
              <input
                type="text"
                required
                value={formData.razon_social_o_nombre}
                onChange={(e) => setFormData({ ...formData, razon_social_o_nombre: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#473198] mb-1">Telefono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 border border-[#9BF3F0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" variant="primary" isLoading={createMutation.isLoading || updateMutation.isLoading}>
                {editingClient ? 'Actualizar Cliente' : 'Crear Cliente'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#473198] border-t-transparent"></div>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-[#473198]/50 uppercase tracking-wider bg-[#DAFFED]/30 border-b border-[#9BF3F0]/20">
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Documento</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Telefono</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#9BF3F0]/10">
                {clients.length > 0 ? clients.map((c) => (
                  <tr key={c.id} className="hover:bg-[#DAFFED]/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#473198]">{c.razon_social_o_nombre}</td>
                    <td className="px-6 py-4 text-sm text-[#473198]/60">{c.numero_documento}</td>
                    <td className="px-6 py-4 text-sm text-[#473198]/60">{c.email || '—'}</td>
                    <td className="px-6 py-4 text-sm text-[#473198]/60">{c.telefono || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewHistory(c)}
                          className="p-1.5 text-[#473198]/50 hover:text-[#473198] transition-colors"
                          title="Ver historial"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-1.5 text-[#473198]/50 hover:text-[#473198] transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.razon_social_o_nombre)}
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
                    <td colSpan="5" className="px-6 py-12 text-center text-[#473198]/40">
                      No se encontraron clientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Purchase History Modal */}
      {showHistory && selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[#9BF3F0]/20">
              <div>
                <h3 className="text-xl font-black text-[#473198]">Historial de Compras</h3>
                <p className="text-sm text-[#473198]/60">{selectedClient.razon_social_o_nombre}</p>
              </div>
              <button onClick={() => { setShowHistory(false); setSelectedClient(null); }} className="p-2 hover:bg-[#DAFFED]/50 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-[#473198]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#473198] border-t-transparent"></div>
                </div>
              ) : purchases.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-bold text-[#473198]/50 uppercase tracking-wider border-b border-[#9BF3F0]/20">
                      <th className="pb-3 pr-4">Documento</th>
                      <th className="pb-3 text-right">Total</th>
                      <th className="pb-3 text-right">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#9BF3F0]/10">
                    {purchases.map((p) => (
                      <tr key={p.id} className="hover:bg-[#DAFFED]/30">
                        <td className="py-3 pr-4 text-sm font-bold text-[#473198]">{p.numero_documento}</td>
                        <td className="py-3 text-sm font-black text-[#473198] text-right">${Number(p.total).toLocaleString()}</td>
                        <td className="py-3 text-sm text-[#473198]/50 text-right">{new Date(p.created_at).toLocaleDateString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-[#473198]/40 py-8">No hay compras registradas</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientSmart;
