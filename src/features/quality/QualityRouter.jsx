import { Routes, Route } from 'react-router-dom';

const QualityRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<div className="p-6"><h2>Quality Dashboard</h2></div>} />
      <Route path="/pqrs" element={<div className="p-6"><h2>Peticiones, Quejas, Reclamos y Sugerencias</h2></div>} />
      <Route path="/temperaturas" element={<div className="p-6"><h2>Registros Temp. & Humedad</h2></div>} />
      <Route path="/inyectologias" element={<div className="p-6"><h2>Inyectologías</h2></div>} />
    </Routes>
  );
};

export default QualityRouter;
