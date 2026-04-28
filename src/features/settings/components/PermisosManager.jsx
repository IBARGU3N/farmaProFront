import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { TextInput } from '../../../components/ui/TextInput';
import { Toast } from '../../../components/ui/Toast';

const ROLES = ['admin', 'cajero', 'inventario', 'usuario'];

const PermisosManager = () => {
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPermissions();
    fetchRolePermissions(selectedRole);
  }, [selectedRole]);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/admin/permissions');
      setPermissions(response.data.data);
    } catch (error) {
      Toast.error('Error loading permissions');
    }
  };

  const fetchRolePermissions = async (role) => {
    try {
      const response = await api.get(`/admin/permissions/role/${role}`);
      const permissionsList = response.data.data.map(p => p.name);
      setRolePermissions(permissionsList);
    } catch (error) {
      Toast.error('Error loading role permissions');
    }
  };

  const togglePermission = (permissionName) => {
    const current = [...rolePermissions];
    if (current.includes(permissionName)) {
      setRolePermissions(current.filter(p => p !== permissionName));
    } else {
      setRolePermissions([...current, permissionName]);
    }
  };

  const savePermissions = async () => {
    setLoading(true);
    try {
      // We need to send IDs, not names.
      const permissionIds = await Promise.all(
        rolePermissions.map(async (name) => {
          const p = permissions.find(p => p.name === name);
          return p ? p.id : null;
        })
      );

      await api.put(`/admin/permissions/role/${selectedRole}`, {
        permissions: permissionIds.filter(id => id !== null),
      });
      Toast.success('Permissions updated successfully');
    } catch (error) {
      Toast.error('Error saving permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Gestión de Permisos</h2>
      
      <div className="mb-6 flex items-center gap-4">
        <label className="font-medium">Rol a editar:</label>
        <select 
          value={selectedRole} 
          onChange={(e) => setSelectedRole(e.target.value)}
          className="p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
        >
          {ROLES.map(role => (
            <option key={role} value={role}>{role.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left p-3">Permiso</th>
              <th className="text-left p-3">Descripción</th>
              <th className="text-center p-3">Habilitado</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map(p => (
              <tr key={p.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-gray-600 dark:text-gray-400">{p.description}</td>
                <td className="p-3 text-center">
                  <input 
                    type="checkbox" 
                    checked={rolePermissions.includes(p.name)} 
                    onChange={() => togglePermission(p.name)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={savePermissions} loading={loading}>
          Guardar Cambios
        </Button>
      </div>
    </Card>
  );
};

export default PermisosManager;
