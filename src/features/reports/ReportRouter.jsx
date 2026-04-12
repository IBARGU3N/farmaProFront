import { Routes, Route, Navigate } from 'react-router-dom';
import ReportSmart from './components/ReportSmart';

const ReportRouter = () => {
  return (
    <Routes>
      <Route index element={<ReportSmart />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default ReportRouter;
