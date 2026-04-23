import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CajaContainer } from './components/CajaContainer';

export const CajaRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<CajaContainer />} />
    </Routes>
  );
};

export default CajaRouter;
