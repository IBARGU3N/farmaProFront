import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import TextInput from '../../../components/ui/TextInput';
import { ShortcutBadge } from '../../../components/ui/ShortcutBadge';

const ComprasList = ({ 
    compras = [], 
    onEdit, 
    onDelete, 
    onView, 
    onCreate, 
    onSearch, 
    searchTerm = '', 
    isLoading = false 
}) => {
    return (
        <Card className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                    <TextInput 
                        className="pl-10 w-full" 
                        placeholder="Buscar por factura o proveedor..." 
                        value={searchTerm} 
                        onChange={(e) => onSearch(e.target.value)} 
                    />
                </div>
                <Button variant="primary" onClick={onCreate} title="Nueva Compra [Alt+N]">
                    <Plus size={18} className="mr-2" /> <span>Nueva Compra</span> <ShortcutBadge keys="Alt+N" />
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-on-surface-variant text-sm border-b border-on-surface/10">
                            <th className="pb-3 font-medium">Fecha</th>
                            <th className="pb-3 font-medium">Proveedor</th>
                            <th className="pb-3 font-medium">N° Factura</th>
                            <th className="pb-3 font-medium text-right">Total</th>
                            <th className="pb-3 font-medium text-center">Estado</th>
                            <th className="pb-3 font-medium text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-on-surface/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-on-surface-variant">Cargando compras...</td>
                            </tr>
                        ) : compras.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-on-surface-variant">No se encontraron compras.</td>
                            </tr>
                        ) : (
                            compras.map((compra) => (
                                <tr key={compra.id} className="hover:bg-surface-container-low transition-colors">
                                    <td className="py-4 text-sm">{compra.fecha}</td>
                                    <td className="py-4 font-medium">{compra.tercero?.razon_social_o_nombre}</td>
                                    <td className="py-4 text-sm">{compra.numero_factura || 'N/A'}</td>
                                    <td className="py-4 text-right font-semibold">${compra.total.toFixed(2)}</td>
                                    <td className="py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            compra.estado === 'recibido' ? 'bg-green-100 text-green-700' : 
                                            compra.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : 
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {compra.estado.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex justify-center gap-2">
                                            <Button variant="ghost" onClick={() => onView(compra.id)} className="p-1 text-primary">
                                                <Eye size={16} />
                                            </Button>
                                            <Button variant="ghost" onClick={() => onEdit(compra.id)} className="p-1 text-blue-600">
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="ghost" onClick={() => onDelete(compra.id)} className="p-1 text-error">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ComprasList;
