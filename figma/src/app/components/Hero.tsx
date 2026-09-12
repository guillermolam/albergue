import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { WiredButton } from './doodle/WiredButton';
import { DoodleBadge } from './doodle/DoodleBadge';
import { AnimatedBackground } from './doodle/AnimatedBackground';
import hostelSketch from 'figma:asset/1c53bfff60bdfdf08f71d2beb25d013a5bd9e8ac.png';

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  return (
    <div ref={ref} className="relative h-[100vh] flex items-center justify-center overflow-hidden paper-texture bg-gradient-to-b from-[#87CEEB] via-[#E8F5E9] to-[#FFF9F0]">
      {/* Animated Doodle Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0"
      >
        <AnimatedBackground />
      </motion.div>
      
      {/* Hostel Sketch Image */}
      <motion.div
        style={{ y, opacity }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.img
          src={hostelSketch}
          alt="Albergue Municipal de Carrascalejo sketch"
          className="w-full h-full object-cover"
          style={{ 
            mixBlendMode: 'multiply',
            filter: 'contrast(1.1) brightness(1.05)'
          }}
          animate={{ 
            filter: [
              'contrast(1.1) brightness(1.05)',
              'contrast(1.15) brightness(1.1)',
              'contrast(1.1) brightness(1.05)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      {/* Floating doodle badges */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-24 left-8 md:left-16 z-10"
      >
        <div className="flex flex-wrap gap-3">
          <DoodleBadge color="#D4A574">
            📍 Mérida, Extremadura
          </DoodleBadge>
          <DoodleBadge color="#00AB39">
            🛏️ 24 beds
          </DoodleBadge>
          <DoodleBadge color="#0071BC">
            🏠 2 dorms
          </DoodleBadge>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.4,
            type: "spring",
            stiffness: 80
          }}
        >
          <motion.div
            className="relative inline-block"
            animate={{ 
              y: [0, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-[#5D4E37] mb-4 leading-tight sketch-title drop-shadow-lg">
              Albergue Municipal de
            </h1>
          </motion.div>
          <motion.div
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1 className="hand-drawn text-6xl md:text-8xl lg:text-9xl text-[#00AB39] mb-6 inline-block drop-shadow-xl" style={{ textShadow: '3px 3px 0px rgba(255,255,255,0.8)' }}>
              Carrascalejo
            </h1>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative inline-block"
        >
          <p className="text-2xl md:text-4xl text-[#5D4E37] mb-4 italic sketch-underline drop-shadow-lg" style={{ textShadow: '2px 2px 0px rgba(255,255,255,0.9)' }}>
            Your rest on the Camino de Santiago
          </p>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-lg md:text-xl text-[#5D4E37] mb-10 max-w-2xl mx-auto drop-shadow" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.9)' }}
        >
          Welcome to our pilgrim hostel in <span className="highlight-doodle">Extremadura, Spain</span>. 
          Comfortable beds, warm hospitality, and a peaceful stop on your journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Link to="/book">
            <WiredButton size="lg" variant="primary">
              Book Your Stay! →
            </WiredButton>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[#5D4E37]"
        >
          <motion.div 
            whileHover={{ y: -2 }} 
            className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full doodle-border"
          >
            <motion.div 
              className="w-3 h-3 bg-[#00AB39] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-medium">Traditional hospitality</span>
          </motion.div>
          <motion.div 
            whileHover={{ y: -2 }} 
            className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full doodle-border"
          >
            <motion.div 
              className="w-3 h-3 bg-[#00AB39] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <span className="font-medium">Heart of the Camino</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Doodle scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.svg
          width="40"
          height="60"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Hand-drawn scroll indicator */}
          <rect
            x="5"
            y="5"
            width="30"
            height="50"
            rx="15"
            fill="white"
            fillOpacity="0.8"
            stroke="#5D4E37"
            strokeWidth="2.5"
          />
          <motion.circle
            cx="20"
            cy="18"
            r="4"
            fill="#00AB39"
            animate={{ cy: [18, 32, 18] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}