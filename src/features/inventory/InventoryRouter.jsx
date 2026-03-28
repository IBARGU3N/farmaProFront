import { Routes, Route } from 'react-router-dom';

const InventoryRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<div className="p-6"><h2>Inventory Dashboard</h2></div>} />
      <Route path="/laboratorios" element={<div className="p-6"><h2>Laboratorios List</h2></div>} />
      <Route path="/productos" element={<div className="p-6"><h2>Productos Catalog</h2></div>} />
      <Route path="/lotes" element={<div className="p-6"><h2>Inventario y Lotes</h2></div>} />
    </Routes>
  );
};

export default InventoryRouter;
