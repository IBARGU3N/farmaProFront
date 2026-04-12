import { motion } from 'framer-motion';

export const Card = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/80 backdrop-blur-md border border-[#9BF3F0]/30 rounded-3xl shadow-xl shadow-[#473198]/5 ${className}`}
    >
      {children}
    </motion.div>
  );
};


