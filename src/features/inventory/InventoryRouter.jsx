import { Routes, Route, Navigate } from 'react-router-dom';
import InventorySmart from './components/InventorySmart';

const InventoryRouter = () => {
  return (
    <Routes>
      <Route index element={<InventorySmart />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default InventoryRouter;
