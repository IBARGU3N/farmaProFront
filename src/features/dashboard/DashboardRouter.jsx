import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardSmart from './components/DashboardSmart';

const DashboardRouter = () => {
  return (
    <Routes>
      <Route index element={<DashboardSmart />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default DashboardRouter;
