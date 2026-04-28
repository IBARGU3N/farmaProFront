import React, { useState, useEffect } from 'react';

const ResolucionesForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        prefix: '',
        initial_number: '',
        final_number: '',
        current_number: '',
        resolution_date: '',
        document_type: 'Factura',
        is_active: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Prefijo</label>
                    <input type="text" name="prefix" value={formData.prefix} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                    <select name="document_type" value={formData.document_type} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
                        <option value="Factura">Factura</option>
                        <option value="POS">POS</option>
                        <option value="NC">Nota Crédito</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Número Inicial</label>
                    <input type="number" name="initial_number" value={formData.initial_number} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Número Final</label>
                    <input type="number" name="final_number" value={formData.final_number} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Número Actual</label>
                    <input type="number" name="current_number" value={formData.current_number} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Resolución</label>
                    <input type="date" name="resolution_date" value={formData.resolution_date} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" required />
                </div>
            </div>
            <div className="flex items-center">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="mr-2" />
                <label className="text-sm font-medium text-gray-700">Resolución Activa</label>
            </div>
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Guardar</button>
            </div>
        </form>
    );
};

export default ResolucionesForm;
