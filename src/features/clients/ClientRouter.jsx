import { Routes, Route, Navigate } from 'react-router-dom';
import ClientSmart from './components/ClientSmart';

const ClientRouter = () => {
  return (
    <Routes>
      <Route index element={<ClientSmart />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default ClientRouter;
