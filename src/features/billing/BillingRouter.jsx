import { Routes, Route, Navigate } from 'react-router-dom';
import BillingPlaceholder from './components/BillingPlaceholder';

const BillingRouter = () => {
  return (
    <Routes>
      <Route index element={<BillingPlaceholder />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default BillingRouter;
