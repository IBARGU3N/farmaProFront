import { useState, useEffect } from 'react';

export const InventoryFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  stockFilter,
  onStockFilterChange,
  onClear,
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="px-4 py-2 border border-[#9BF3F0]/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#473198]/20 w-64"
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 border border-[#9BF3F0]/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
      >
        <option value="">Todas las categorias</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select
        value={stockFilter}
        onChange={(e) => onStockFilterChange(e.target.value)}
        className="px-4 py-2 border border-[#9BF3F0]/30 rounded-xl bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#473198]/20"
      >
        <option value="">Todo el stock</option>
        <option value="low">Stock bajo</option>
        <option value="out">Sin stock</option>
        <option value="expiring">Proximo a vencer</option>
      </select>
      {(search || category || stockFilter) && (
        <button
          onClick={onClear}
          className="px-3 py-2 text-sm text-[#473198]/60 hover:text-[#473198] font-bold transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};
