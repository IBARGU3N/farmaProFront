import { Routes, Route, Navigate } from 'react-router-dom';
import SupplierSmart from './components/SupplierSmart';

const SupplierRouter = () => {
  return (
    <Routes>
      <Route index element={<SupplierSmart />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default SupplierRouter;
