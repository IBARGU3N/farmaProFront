import { create } from 'zustand';

export const useAlertStore = create((set) => ({
  alerts: [],
  alertCount: 0,
  isOpen: false,

  setAlerts: (alerts) => set({ alerts, alertCount: alerts.length }),
  setAlertCount: (count) => set({ alertCount: count }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  closePanel: () => set({ isOpen: false }),
  dismissAlert: (index) => set((state) => ({
    alerts: state.alerts.filter((_, i) => i !== index),
    alertCount: state.alertCount - 1,
  })),
}));
