import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ComprasSmart from './components/ComprasSmart';

const ComprasRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ComprasSmart />} />
        </Routes>
    );
};

export default ComprasRouter;
