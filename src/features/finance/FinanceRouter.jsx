import { Routes, Route } from 'react-router-dom';

const FinanceRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<div className="p-6"><h2>Finance Dashboard</h2></div>} />
      <Route path="/pos" element={<div className="p-6"><h2>Point of Sale (Caja)</h2></div>} />
      <Route path="/facturas" element={<div className="p-6"><h2>Facturación</h2></div>} />
      <Route path="/cxp" element={<div className="p-6"><h2>Cuentas por Pagar</h2></div>} />
    </Routes>
  );
};

export default FinanceRouter;
