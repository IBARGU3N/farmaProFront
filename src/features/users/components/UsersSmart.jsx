import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';

const UsersSmart = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rol: 'cajero',
  });

  const { data, isLoading } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const users = data?.data?.data || data?.data || [];

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', rol: 'cajero' });
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateMutation.mutate(
        { id: editingUser.id, data: formData },
        {
          onSuccess: () => {
            toast.success('Usuario actualizado');
            setShowForm(false);
            resetForm();
          },
          onError: (err) => toast.error(err.response?.data?.message || 'Error al actualizar'),
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success('Usuario creado');
          setShowForm(false);
          resetForm();
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Error al crear'),
      });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', rol: user.rol });
    setShowForm(true);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Eliminar a "${name}"?`)) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Usuario eliminado'),
      onError: () => toast.error('Error al eliminar'),
    });
  };

  const rolColors = {
    admin: 'bg-purple-100 text-purple-700',
    cajero: 'bg-blue-100 text-blue-700',
    inventario: 'bg-green-100 text-green-700',
  };

  return (
    <div className="p-6 bg-surface/20 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary">Usuarios</h1>
          <p className="text-primary/60 mt-1">Gestion de usuarios y roles</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold text-primary mb-4">
            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-bold text-primary mb-1">Nombre *</label>

              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                 className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"

              />
            </div>
            <div>
               <label className="block text-sm font-bold text-primary mb-1">Email *</label>

              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"

              />
            </div>
            <div>
               <label className="block text-sm font-bold text-primary mb-1">

                Contrasena {editingUser && '(dejar vacio para no cambiar)'}
              </label>
              <input
                type="password"
                required={!editingUser}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                 className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"

              />
            </div>
            <div>
               <label className="block text-sm font-bold text-primary mb-1">Rol *</label>

              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                 className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"

              >
                <option value="admin">Administrador</option>
                <option value="cajero">Cajero</option>
                <option value="inventario">Inventario</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" variant="primary" isLoading={createMutation.isLoading || updateMutation.isLoading}>
                {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
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

                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
               <tbody className="divide-y divide-secondary/10">

                {users.length > 0 ? users.map((u) => (
                   <tr key={u.id} className="hover:bg-surface/30 transition-colors">

                     <td className="px-6 py-4 font-bold text-primary">{u.name}</td>

                     <td className="px-6 py-4 text-sm text-primary/60">{u.email}</td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${rolColors[u.rol] || 'bg-gray-100 text-gray-700'}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button onClick={() => handleEdit(u)} className="p-1.5 text-primary/50 hover:text-primary transition-colors" title="Editar">

                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(u.id, u.name)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors" title="Eliminar">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                     <td colSpan="4" className="px-6 py-12 text-center text-primary/40">

                      No se encontraron usuarios
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

export default UsersSmart;
