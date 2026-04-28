import React, { useState } from 'react';
import { useFolios } from '../hooks/useFolios';
import ResolucionesTable from './ResolucionesTable';
import ResolucionesForm from './ResolucionesForm';
import axios from 'axios';

const ResolucionesPage = () => {
    const { resolutions, loading, error, refresh } = useFolios();
    const [editingRes, setEditingRes] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleSave = async (data) => {
        try {
            if (editingRes) {
                await axios.put(`/api/v1/pos/resolutions/${editingRes.id}`, data);
            } else {
                await axios.post('/api/v1/pos/resolutions', data);
            }
            setShowForm(false);
            setEditingRes(null);
            refresh();
        } catch (err) {
            alert(err.response?.data?.error || 'Error saving resolution');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar esta resolución?')) return;
        try {
            await axios.delete(`/api/v1/pos/resolutions/${id}`);
            refresh();
        } catch (err) {
            alert(err.response?.data?.error || 'Error deleting resolution');
        }
    };

    if (loading) return <div className="p-6 text-center">Cargando...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Control de Resoluciones Documentales</h1>
                {!showForm && (
                    <button 
                        onClick={() => { setShowForm(true); setEditingRes(null); }} 
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        + Nueva Resolución
                    </button>
                )}
            </div>

            {showForm ? (
                <ResolucionesForm 
                    initialData={editingRes} 
                    onSubmit={handleSave} 
                    onCancel={() => { setShowForm(false); setEditingRes(null); }} 
                />
            ) : (
                <ResolucionesTable 
                    resolutions={resolutions} 
                    onDelete={handleDelete} 
                    onEdit={(res) => { setEditingRes(res); setShowForm(true); }} 
                />
            )}
        </div>
    );
};

export default ResolucionesPage;
