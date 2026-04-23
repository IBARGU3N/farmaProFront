import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import ComprasList from './ComprasList';
import CompraForm from './CompraForm';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import { ShortcutBadge } from '../../../components/ui/ShortcutBadge';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';

const API_BASE = '/api/v1';

const ComprasSmart = () => {
    const queryClient = useQueryClient();
    const [view, setView] = useState('list'); // 'list', 'create', 'edit', 'detail'
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const formRef = useRef(null);

    // Keyboard Shortcuts
    useKeyboardShortcuts([
        {
            key: 'F12',
            action: () => {
                if (view === 'create' || view === 'edit') {
                    // Si estamos en el formulario, intenta guardarlo
                    if (formRef.current) {
                        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                } else {
                    // Si estamos en la lista, abre nueva compra
                    setView('create');
                    setSelectedId(null);
                    setErrors({});
                    setGlobalError('');
                    toast.success('Formulario de nueva compra abierto');
                }
            },
            label: 'Procesar Compra',
        },
        {
            key: 'n',
            alt: true,
            action: () => {
                setView('create');
                setSelectedId(null);
                setErrors({});
                setGlobalError('');
                toast('Formulario de nueva compra abierto', { icon: '📝', duration: 1200 });
            },
            label: 'Nueva compra',
        },
        {
            key: 'Escape',
            action: () => {
                if (view !== 'list') {
                    handleCancel();
                }
            },
            label: 'Cancelar',
        },
    ]);

    // Fetch Providers and Products
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [provRes, prodRes] = await Promise.all([
                    axios.get(`${API_BASE}/suppliers`),
                    axios.get(`${API_BASE}/products`)
                ]);
                setProveedores(provRes.data.data || provRes.data);
                setProductos(prodRes.data.data || prodRes.data);
            } catch (err) {
                console.error('Error fetching master data', err);
                toast.error('Error al cargar proveedores y productos');
            }
        };
        fetchData();
    }, []);

    const { data: comprasData, isLoading, isError } = useQuery({
        queryKey: ['compras', searchTerm],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE}/compras`, {
                params: { search: searchTerm }
            });
            return response.data.data;
        }
    });

    const { data: currentCompra, isLoading: isLoadingDetail } = useQuery({
        queryKey: ['compra', selectedId],
        queryFn: async () => {
            if (!selectedId) return null;
            const response = await axios.get(`${API_BASE}/compras/${selectedId}`);
            return response.data.data;
        },
        enabled: !!selectedId && (view === 'edit' || view === 'detail')
    });

    const mutation = useMutation({
        mutationFn: async ({ id, data }) => {
            if (id) {
                return axios.put(`${API_BASE}/compras/${id}`, data);
            }
            return axios.post(`${API_BASE}/compras`, data);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['compras'] });
            setView('list');
            setErrors({});
            setGlobalError('');
            const mensaje = selectedId ? 'Compra actualizada correctamente' : 'Compra procesada y stock actualizado correctamente';
            toast.success(mensaje);
        },
        onError: (err) => {
            console.error('Error en mutación:', err.response);
            
            if (err.response?.status === 422) {
                // Errores de validación
                setErrors(err.response.data.errors || {});
                setGlobalError('Por favor verifica los errores en el formulario');
                toast.error('Validación fallida. Revisa los campos con error.');
            } else if (err.response?.status === 401) {
                setGlobalError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
                toast.error('Sesión expirada');
            } else if (err.response?.status === 403) {
                setGlobalError('No tienes permiso para realizar esta acción.');
                toast.error('Permiso denegado');
            } else {
                const mensaje = err.response?.data?.message || 'Error al procesar la compra';
                setGlobalError(mensaje);
                toast.error(mensaje);
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => axios.delete(`${API_BASE}/compras/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compras'] });
            toast.success('Compra eliminada correctamente');
        },
        onError: (err) => {
            const mensaje = err.response?.data?.message || 'Error al eliminar la compra';
            toast.error(mensaje);
        }
    });

    const handleSave = (data) => {
        setErrors({});
        setGlobalError('');
        mutation.mutate({ id: selectedId, data });
    };

    const handleCancel = () => {
        setView('list');
        setErrors({});
        setGlobalError('');
        setSelectedId(null);
    };

    if (view === 'create' || view === 'edit') {
        return (
            <div className="p-6 bg-clinical-ether min-h-screen">
                {globalError && (
                    <div className="mb-4 p-4 bg-error/10 border border-error rounded-lg">
                        <p className="text-error font-medium">{globalError}</p>
                    </div>
                )}
                <CompraForm 
                    ref={formRef}
                    initialData={currentCompra || {}} 
                    onSubmit={handleSave} 
                    onCancel={handleCancel}
                    proveedores={proveedores}
                    productos={productos}
                    errors={errors}
                    isLoading={mutation.isPending}
                />
            </div>
        );
    }

    if (view === 'detail' && currentCompra) {
        return (
            <div className="p-6 bg-clinical-ether min-h-screen">
                <Card className="p-6 max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-headline font-bold text-on-surface">Detalle de Compra</h2>
                        <Button variant="secondary" onClick={() => setView('list')}>Volver</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-on-surface-variant">Proveedor</p>
                            <p className="font-medium">{currentCompra.tercero?.razon_social_o_nombre}</p>
                        </div>
                        <div>
                            <p className="text-sm text-on-surface-variant">N° Factura</p>
                            <p className="font-medium">{currentCompra.numero_factura || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-on-surface-variant">Fecha</p>
                            <p className="font-medium">{currentCompra.fecha}</p>
                        </div>
                        <div>
                            <p className="text-sm text-on-surface-variant">Estado</p>
                            <p className="font-medium capitalize">{currentCompra.estado}</p>
                        </div>
                    </div>
                    <table className="w-full text-left mb-6">
                        <thead>
                            <tr className="text-on-surface-variant text-sm border-b border-on-surface/10">
                                <th className="pb-2">Producto</th>
                                <th className="pb-2 text-center">Cant.</th>
                                <th className="pb-2 text-right">Precio</th>
                                <th className="pb-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-on-surface/5">
                            {currentCompra.detalles?.map((det, i) => (
                                <tr key={i}>
                                    <td className="py-2">{det.producto?.nombre}</td>
                                    <td className="py-2 text-center">{det.cantidad}</td>
                                    <td className="py-2 text-right">${det.precio_unitario.toFixed(2)}</td>
                                    <td className="py-2 text-right">${det.subtotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end space-y-2 text-right">
                        <p className="text-on-surface-variant">Subtotal: ${currentCompra.subtotal.toFixed(2)}</p>
                        <p className="text-on-surface-variant">Impuesto: ${currentCompra.impuesto.toFixed(2)}</p>
                        <p className="text-xl font-bold text-primary">Total: ${currentCompra.total.toFixed(2)}</p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 bg-clinical-ether min-h-screen">
            <ComprasList 
                compras={comprasData || []} 
                isLoading={isLoading} 
                searchTerm={searchTerm} 
                onSearch={setSearchTerm} 
                onCreate={() => { setView('create'); setSelectedId(null); setErrors({}); setGlobalError(''); }} 
                onEdit={(id) => { setSelectedId(id); setView('edit'); setErrors({}); setGlobalError(''); }} 
                onView={(id) => { setSelectedId(id); setView('detail'); }} 
                onDelete={(id) => {
                    if (window.confirm('¿Está seguro de eliminar esta compra?')) {
                        deleteMutation.mutate(id);
                    }
                }}
            />
        </div>
    );
};

export default ComprasSmart;
