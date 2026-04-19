import React from 'react';
import { motion } from 'framer-motion';
import useUIStore from '../../store/uiStore';

export const BackgroundDecoration = () => {
  const { primaryColor } = useUIStore();

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Top Left Gradient Orb */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      
      {/* Bottom Right Gradient Orb */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
        className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl"
      />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
      />
      
      {/* Clinical Ether Overlay */}
      <div className="absolute inset-0 bg-clinical-ether" />
    </div>
  );
};

