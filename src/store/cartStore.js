import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  client: null,
  discount: 0,

  addItem: (product, quantity = 1) => {
    const { items } = get();
    const existing = items.find((item) => item.producto_id === product.id);

    if (existing) {
      set({
        items: items.map((item) =>
          item.producto_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({
        items: [...items, {
          producto_id: product.id,
          nombre: product.nombre,
          precio: product.precio_venta || 0,
          quantity,
          descuento: 0,
        }],
      });
    }
  },

  removeItem: (producto_id) => {
    set({ items: get().items.filter((item) => item.producto_id !== producto_id) });
  },

  updateQuantity: (producto_id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(producto_id);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.producto_id === producto_id ? { ...item, quantity } : item
      ),
    });
  },

  setClient: (client) => set({ client }),

  setDiscount: (discount) => set({ discount }),

  clearCart: () => set({ items: [], client: null, discount: 0 }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    return subtotal - get().discount;
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
