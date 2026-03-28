import { Routes, Route, Navigate } from 'react-router-dom';
import POSPlaceholder from './components/POSPlaceholder';

const POSRouter = () => {
  return (
    <Routes>
      <Route index element={<POSPlaceholder />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default POSRouter;
