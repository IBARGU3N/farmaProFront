import { Routes, Route, Navigate } from 'react-router-dom';
import UsersSmart from './components/UsersSmart';

const UsersRouter = () => {
  return (
    <Routes>
      <Route index element={<UsersSmart />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default UsersRouter;
