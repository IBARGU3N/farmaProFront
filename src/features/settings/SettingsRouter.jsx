import { Routes, Route, Navigate } from 'react-router-dom';
import SettingsSmart from './components/SettingsSmart';
import PermisosManager from './components/PermisosManager';
import GuardadoPorPermiso from '../../components/ui/GuardadoPorPermiso';
import PrintersRouter from './PrintersRouter';

const SettingsRouter = () => {
  return (
    <Routes>
      <Route index element={<SettingsSmart />} />
      <Route 
        path="permissions" 
        element={
          <GuardadoPorPermiso 
            permission="permissions.manage" 
            fallback={<Navigate to="." replace />}
          >
            <PermisosManager />
          </GuardadoPorPermiso>
        } 
      />
      <Route path="printers" element={<PrintersRouter />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default SettingsRouter;
