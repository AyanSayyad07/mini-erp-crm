import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '8px',
  className = '',
  style = {}
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ 
        repeat: Infinity, 
        repeatType: "reverse", 
        duration: 1, 
        ease: "easeInOut" 
      }}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--border-color)', // Use theme-aware gray
        ...style
      }}
    />
  );
};

export default Skeleton;
