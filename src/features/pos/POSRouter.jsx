import { Routes, Route, Navigate } from 'react-router-dom';
import POSSmart from './components/POSSmart';

const POSRouter = () => {
  return (
    <Routes>
      <Route index element={<POSSmart />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default POSRouter;
