import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface IllustratedCardProps {
  children: ReactNode;
  delay?: number;
  rotate?: number;
}

export function IllustratedCard({ children, delay = 0, rotate = 0 }: IllustratedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8, 
        rotateY: rotate,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      viewport={{ once: true }}
      className="relative group"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/* Sketchy shadow effect */}
      <div className="absolute inset-0 bg-black/5 rounded-2xl transform translate-y-2 translate-x-2 -z-10 blur-sm" />
      <div className="absolute inset-0 bg-black/5 rounded-2xl transform translate-y-1 translate-x-1 -z-10" />
      
      {/* Main card */}
      <div className="bg-white rounded-2xl border-4 border-black/80 p-8 relative overflow-hidden grain-overlay shadow-xl">
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00AB39] rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#D4A574] rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#0071BC] rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#EAC102] rounded-br-xl" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Hover highlight */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#00AB39]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </motion.div>
  );
}
