import { Routes, Route } from 'react-router-dom';

const CoreRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<div className="p-6"><h2>Core Dashboard Integration</h2></div>} />
      <Route path="/terceros" element={<div className="p-6"><h2>Terceros Management</h2></div>} />
      <Route path="/settings" element={<div className="p-6"><h2>Configuración</h2></div>} />
    </Routes>
  );
};

export default CoreRouter;
