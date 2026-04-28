import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService, inventoryService } from '../../../services/inventory/inventoryService';
import { useDeleteProduct, useLaboratorios } from '../hooks/useInventory';
import { ProductFormModalSmart } from './ProductFormModalSmart';
import { LotManagerSmart } from './LotManagerSmart';
import { InventoryFilters } from './InventoryFilters';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import ErrorBoundary from '../../../components/common/ErrorBoundary';
import { ShortcutBadge } from '../../../components/ui/ShortcutBadge';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import toast from 'react-hot-toast';

const InventorySmart = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 15;

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', search, category, page],
    queryFn: () => productService.getAll({ search: search || undefined, category: category || undefined, per_page: perPage }),
  });

  const { data: labsData } = useLaboratorios();
  const { data: summaryData } = useQuery({
    queryKey: ['inventory-summary'],
    queryFn: () => inventoryService.summary(),
  });

  const deleteMutation = useDeleteProduct();

  const products = productsData?.data?.data || productsData?.data || [];
  const totalItems = productsData?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / perPage);

  const categories = useMemo(() => {
    const cats = new Set();
    products.forEach((p) => { if (p.categoria) cats.add(p.categoria); });
    return Array.from(cats).sort();
  }, [products]);

  const summary = summaryData?.data || {};

  const handleDelete = (id, nombre) => {
    if (!window.confirm(`Esta seguro de eliminar "${nombre}"?`)) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Producto eliminado'),
      onError: () => toast.error('Error al eliminar producto'),
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setStockFilter('');
    setPage(1);
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) return { text: 'Sin stock', class: 'bg-neutral-container text-neutral' };
    if (stock <= 10) return { text: 'Stock bajo', class: 'bg-error-container text-error' };
    if (stock <= 50) return { text: 'Normal', class: 'bg-warning-container text-warning' };
    return { text: 'Disponible', class: 'bg-success-container text-success' };
  };

  useKeyboardShortcuts([
    {
      key: 'n',
      alt: true,
      action: () => {
        setEditingProduct(null);
        setShowProductForm(true);
        toast('Formulario de nuevo producto abierto', { icon: '📝', duration: 1200 });
      },
      label: 'Nuevo producto',
    },
    {
      key: 'Escape',
      action: () => {
        if (showProductForm) {
          handleCloseForm();
        }
      },
      label: 'Cerrar formulario',
    },
  ]);

  return (
    <ErrorBoundary>
      <div className="p-6 bg-surface/20 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-primary">Inventario</h1>
            <p className="text-primary/60 mt-1">Gestion de productos y lotes</p>
          </div>
          <Button variant="primary" onClick={() => { setEditingProduct(null); setShowProductForm(true); }} title="Nuevo Producto [Alt+N]">
            <span>+ Nuevo Producto</span> <ShortcutBadge keys="Alt+N" />
          </Button>
        </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-xs text-primary/50 font-bold uppercase">Total Productos</p>
          <p className="text-2xl font-black text-primary">{summary.totals?.total_products || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-primary/50 font-bold uppercase">Total Lotes</p>
          <p className="text-2xl font-black text-primary">{summary.totals?.total_lots || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-primary/50 font-bold uppercase">Unidades en Stock</p>
          <p className="text-2xl font-black text-primary">{summary.totals?.total_stock_units || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-primary/50 font-bold uppercase">Alertas</p>
          <p className="text-2xl font-black text-red-600">{(summary.alerts?.low_stock_count || 0) + (summary.alerts?.expiring_soon_count || 0) + (summary.alerts?.expired_count || 0)}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <InventoryFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          onClear={handleClearFilters}
        />
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-primary/50 uppercase tracking-wider bg-surface/30 border-b border-surface-container-low/20">
                  <th className="px-6 py-4 w-10"></th>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Codigo</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Laboratorio</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4">Impuesto</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low/10">
                {products.length > 0 ? products.map((p, index) => {
                  const stock = p.total_stock || 0;
                  const badge = getStockBadge(stock);
                  const isExpanded = expandedProductId === p.id;
                  return (
                    <React.Fragment key={p.id || index}>
                      <tr className="hover:bg-surface/30 transition-colors cursor-pointer" onClick={() => setExpandedProductId(isExpanded ? null : p.id)}>
                        <td className="px-6 py-4">
                          <svg className={`w-4 h-4 text-primary/40 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">{p.nombre}</td>
                        <td className="px-6 py-4 text-sm text-primary/60">{p.codigo_barras || '—'}</td>
                        <td className="px-6 py-4 text-sm text-primary/60">{p.categoria || '—'}</td>
                        <td className="px-6 py-4 text-sm text-primary/60">{p.laboratorio?.nombre || '—'}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.class}`}>
                            {stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-primary/60">{p.porcentaje_impuesto}%</td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-1.5 text-primary/50 hover:text-primary transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.nombre)}
                              className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${p.id}-lots`}>
                          <td colSpan="8" className="px-6 py-4 bg-surface/10">
                            <LotManagerSmart productId={p.id} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-primary/40">
                      No se encontraron productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-surface-container-low/20">
              <p className="text-sm text-primary/50">
                Mostrando {((page - 1) * perPage) + 1} - {Math.min(page * perPage, totalItems)} de {totalItems}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm font-bold text-primary border border-surface-container-low/30 rounded-lg disabled:opacity-30 hover:bg-surface-container-low/10 transition-colors"
                >
                  Anterior
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 text-sm font-bold rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-primary text-white'
                          : 'text-primary hover:bg-surface-container-low/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm font-bold text-primary border border-surface-container-low/30 rounded-lg disabled:opacity-30 hover:bg-surface-container-low/10 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Product Form Modal */}
      <ProductFormModalSmart
        isOpen={showProductForm}
        onClose={handleCloseForm}
        editingProduct={editingProduct}
      />
    </div>
    </ErrorBoundary>
  );
};

export default InventorySmart;
