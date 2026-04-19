import { motion } from 'framer-motion';

export const Card = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-surface-container-lowest dark:bg-surface-container-low backdrop-blur-md border border-surface-container-low dark:border-surface-container-lowest rounded-3xl shadow-lg shadow-primary/5 ${className}`}
    >
      {children}
    </motion.div>
  );
};


