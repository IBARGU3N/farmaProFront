import React from 'react';

const ResolucionesTable = ({ resolutions, onDelete, onEdit }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prefijo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rango</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {resolutions.map((res) => {
                        const consumption = ((res.current_number - res.initial_number) / (res.final_number - res.initial_number)) * 100;
                        let statusColor = 'bg-green-100 text-green-800';
                        if (consumption >= 90) statusColor = 'bg-red-100 text-red-800';
                        else if (consumption >= 70) statusColor = 'bg-yellow-100 text-yellow-800';

                        return (
                            <tr key={res.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.prefix}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.initial_number} - {res.final_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.current_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.document_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                                        {consumption.toFixed(1)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onEdit(res)} className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                                    <button onClick={() => onDelete(res.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ResolucionesTable;
