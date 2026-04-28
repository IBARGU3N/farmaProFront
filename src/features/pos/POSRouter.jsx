import { Routes, Route, Navigate } from 'react-router-dom';
import POSSmart from './components/POSSmart';
import ResolutionsSmart from './components/ResolutionsSmart';

const POSRouter = () => {
  return (
    <Routes>
      <Route index element={<POSSmart />} />
      <Route path="resolutions" element={<ResolutionsSmart />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default POSRouter;
