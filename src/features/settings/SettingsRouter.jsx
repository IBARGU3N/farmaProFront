import { Routes, Route, Navigate } from 'react-router-dom';
import SettingsSmart from './components/SettingsSmart';

const SettingsRouter = () => {
  return (
    <Routes>
      <Route index element={<SettingsSmart />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default SettingsRouter;
