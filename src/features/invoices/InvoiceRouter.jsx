import { Routes, Route, Navigate } from 'react-router-dom';
import InvoiceSmart from './components/InvoiceSmart';

const InvoiceRouter = () => {
  return (
    <Routes>
      <Route index element={<InvoiceSmart />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default InvoiceRouter;
