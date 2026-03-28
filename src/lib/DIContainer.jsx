import { createContext, useContext } from 'react';
import { authService } from '../services/auth/authService';
// We'll add other services as we create them

const DIContext = createContext(null);

export const DIProvider = ({ children }) => {
  // Create service instances (they are already instantiated as objects)
  const services = {
    authService,
    // posService: ...,
    // billingService: ...,
    // inventoryService: ...,
  };

  return <DIContext.Provider value={services}>{children}</DIContext.Provider>;
};

export const useDI = () => {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useDI must be used within a DIProvider');
  }
  return context;
};
