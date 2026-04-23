import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import TextInput from '../../../components/ui/TextInput';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import { ShortcutBadge } from '../../../components/ui/ShortcutBadge';
import { Plus, Trash2, Save, X } from 'lucide-react';

const CompraForm = ({ 
    initialData = {}, 
    onSubmit, 
    onCancel, 
    proveedores = [], 
    productos = [], 
    errors = {},
    isLoading = false 
}) => {
    const [formData, setFormData] = React.useState({
        tercero_id: initialData.tercero_id || '',
        fecha: initialData.fecha || new Date().toISOString().split('T')[0],
        numero_factura: initialData.numero_factura || '',
        notas: initialData.notas || '',
        detalles: initialData.detalles || [{ producto_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }],
        subtotal: initialData.subtotal || 0,
        impuesto: initialData.impuesto || 0,
        total: initialData.total || 0,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDetailChange = (index, field, value) => {
        const newDetalles = [...formData.detalles];
        newDetalles[index][field] = value;
        
        if (field === 'cantidad' || field === 'precio_unitario') {
            const qty = parseFloat(newDetalles[index].cantidad) || 0;
            const price = parseFloat(newDetalles[index].precio_unitario) || 0;
            newDetalles[index].subtotal = qty * price;
        }
        
        const newSubtotal = newDetalles.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0);
        const impuesto = newSubtotal * 0.19; // Example 19% VAT
        const total = newSubtotal + impuesto;

        setFormData(prev => ({
            ...prev,
            detalles: newDetalles,
            subtotal: newSubtotal,
            impuesto: impuesto,
            total: total
        }));
    };

    const addDetail = () => {
        setFormData(prev => ({
            ...prev,
            detalles: [...prev.detalles, { producto_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }]
        }));
    };

    const removeDetail = (index) => {
        if (formData.detalles.length === 1) return;
        const newDetalles = formData.detalles.filter((_, i) => i !== index);
        const newSubtotal = newDetalles.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0);
        const impuesto = newSubtotal * 0.19;
        const total = newSubtotal + impuesto;

        setFormData(prev => ({
            ...prev,
            detalles: newDetalles,
            subtotal: newSubtotal,
            impuesto: impuesto,
            total: total
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="p-6 w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-headline font-bold text-on-surface">
                    {initialData.id ? 'Editar Compra' : 'Nueva Compra'}
                </h2>
                <Button variant="secondary" onClick={onCancel}>
                    <X size={18} className="mr-2" /> Cancelar
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1 text-on-surface-variant">Proveedor</label>
                        <Select 
                            value={formData.tercero_id} 
                            onChange={(e) => handleInputChange({ target: { name: 'tercero_id', value: e.target.value }})}
                            options={proveedores.map(p => ({ label: p.razon_social_o_nombre, value: p.id }))}
                        />
                        {errors.tercero_id && <span className="text-error text-xs mt-1">{errors.tercero_id}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1 text-on-surface-variant">Fecha</label>
                        <TextInput 
                            type="date" 
                            name="fecha" 
                            value={formData.fecha} 
                            onChange={handleInputChange} 
                        />
                        {errors.fecha && <span className="text-error text-xs mt-1">{errors.fecha}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1 text-on-surface-variant">N° Factura</label>
                        <TextInput 
                            name="numero_factura" 
                            value={formData.numero_factura} 
                            onChange={handleInputChange} 
                        />
                        {errors.numero_factura && <span className="text-error text-xs mt-1">{errors.numero_factura}</span>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-on-surface">Productos</h3>
                        <Button type="button" variant="primary" onClick={addDetail} className="py-1 px-3">
                            <Plus size={16} className="mr-1" /> Agregar
                        </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-on-surface-variant text-sm border-b border-on-surface/10">
                                    <th className="pb-2 font-medium">Producto</th>
                                    <th className="pb-2 font-medium w-24">Cantidad</th>
                                    <th className="pb-2 font-medium w-32">Precio Unit.</th>
                                    <th className="pb-2 font-medium w-32 text-right">Subtotal</th>
                                    <th className="pb-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-on-surface/5">
                                {formData.detalles.map((detalle, index) => (
                                    <tr key={index} className="group">
                                        <td className="py-3 pr-4">
                                            <Select 
                                                value={detalle.producto_id} 
                                                onChange={(e) => handleDetailChange(index, 'producto_id', e.target.value)}
                                                options={productos.map(p => ({ label: p.nombre, value: p.id }))}
                                            />
                                            {errors[`detalles.${index}.producto_id`] && <span className="text-error text-xs block">{errors[`detalles.${index}.producto_id`]}</span>}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <TextInput 
                                                type="number" 
                                                value={detalle.cantidad} 
                                                onChange={(e) => handleDetailChange(index, 'cantidad', e.target.value)} 
                                            />
                                            {errors[`detalles.${index}.cantidad`] && <span className="text-error text-xs block">{errors[`detalles.${index}.cantidad`]}</span>}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <TextInput 
                                                type="number" 
                                                value={detalle.precio_unitario} 
                                                onChange={(e) => handleDetailChange(index, 'precio_unitario', e.target.value)} 
                                            />
                                            {errors[`detalles.${index}.precio_unitario`] && <span className="text-error text-xs block">{errors[`detalles.${index}.precio_unitario`]}</span>}
                                        </td>
                                        <td className="py-3 text-right font-medium">
                                            ${detalle.subtotal.toFixed(2)}
                                        </td>
                                        <td className="py-3 text-center">
                                            <Button 
                                                variant="ghost" 
                                                onClick={() => removeDetail(index)} 
                                                className="text-error hover:bg-error/10 p-1"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1 text-on-surface-variant">Notas</label>
                        <TextArea 
                            name="notas" 
                            value={formData.notas} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-on-surface-variant">
                            <span>Subtotal:</span>
                            <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant">
                            <span>Impuestos (19%):</span>
                            <span className="font-medium">${formData.impuesto.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-on-surface text-xl font-bold border-t border-on-surface/10 pt-2">
                            <span>Total:</span>
                            <span className="text-primary">${formData.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 gap-2">
                    <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="px-8"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block animate-spin mr-2">�ω</span>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" /> <span>Procesar Compra</span> <ShortcutBadge keys="F12" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default CompraForm;
