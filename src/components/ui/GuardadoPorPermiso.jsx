import React from 'react';
import { useAuthStore } from '../../store/authStore';

/**
 * GuardadoPorPermiso wrapper to conditionally render components based on permissions.
 * 
 * @param {Object} props
 * @param {string} props.permission - The permission name required to render children.
 * @param {React.ReactNode} props.children - The components to render if permission is granted.
 * @param {React.ReactNode} props.fallback - Optional component to render if permission is denied.
 */
const GuardadoPorPermiso = ({ permission, children, fallback = null }) => {
  const { permissions } = useAuthStore();

  const hasPermission = permissions.includes(permission);

  if (!hasPermission) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuardadoPorPermiso;
