import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'motion/react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface VisualSlide {
  image: string;
  title: string;
  location: string;
  distance: string;
}

const slides: VisualSlide[] = [
  {
    image:
      'https://images.unsplash.com/photo-1711444898752-251183214453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxncmltJTIwY2FtaW5vJTIwc3BhaW58ZW58MXx8fHwxNzY2MjA5NjE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'The Camino',
    location: 'Vía de la Plata Route',
    distance: 'You are here',
  },
  {
    image:
      'https://images.unsplash.com/photo-1650103134649-5d7621808a1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJpZGElMjByb21hbiUyMHJ1aW5zJTIwc3BhaW58ZW58MXx8fHwxNzY2MjA5NjEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Mérida',
    location: 'Roman Ruins & Amphitheater',
    distance: '35 km away',
  },
  {
    image:
      'https://images.unsplash.com/photo-1681849780303-d64fe9740b20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpZXZhbCUyMHRvd24lMjBzcGFpbnxlbnwxfHx8fDE3NjYyMDk2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Medieval Spain',
    location: 'Historic Towns',
    distance: 'Nearby',
  },
  {
    image:
      'https://images.unsplash.com/photo-1601210026600-6673ca8d0a40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHRyZW1hZHVyYSUyMHNwYWluJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2NjEzMTM4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Extremadura',
    location: 'Natural Landscapes',
    distance: 'All around',
  },
  {
    image:
      'https://images.unsplash.com/photo-1764938196166-744e1adb3807?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFuaXNoJTIwY291bnRyeXNpZGUlMjBoa2ltaW5n8ZW58MXx8fHwxNzY2MjA5NjE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'The Journey',
    location: 'Hiking & Nature',
    distance: 'Every step',
  },
];

export function VisualAreaShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use Motion's useSpring for smooth parallax animations
  const springX = useSpring(0, { stiffness: 150, damping: 20 });
  const springY = useSpring(0, { stiffness: 150, damping: 20 });

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax with smooth spring physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

    springX.set(x);
    springY.set(y);
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[activeIndex];
  const parallaxX = springX.get();
  const parallaxY = springY.get();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px] perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Shadow base */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/5 blur-2xl rounded-3xl transform translate-y-4 scale-95" />

      {/* Main container with 3D transform */}
      <motion.div
        className="relative h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: parallaxX * 0.3,
          rotateX: -parallaxY * 0.3,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
        {/* Doodle border frame */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
          style={{ transform: 'translateZ(30px)' }}
        >
          <defs>
            <filter id="sketchy-border">
              <feTurbulence baseFrequency="0.03" numOctaves="2" result="turbulence" />
              <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
            </filter>
          </defs>
          <rect
            x="4"
            y="4"
            width="calc(100% - 8px)"
            height="calc(100% - 8px)"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="4"
            rx="24"
            filter="url(#sketchy-border)"
          />
          <rect
            x="8"
            y="8"
            width="calc(100% - 16px)"
            height="calc(100% - 16px)"
            fill="none"
            stroke="#00AB39"
            strokeWidth="2"
            rx="20"
            opacity="0.8"
          />
        </svg>

        {/* Image carousel with 3D cards */}
        <div
          className="absolute inset-4 rounded-2xl overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction > 0 ? 300 : -300,
                rotateY: direction > 0 ? 45 : -45,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                x: 0,
                rotateY: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: direction > 0 ? -300 : 300,
                rotateY: direction > 0 ? -45 : 45,
                scale: 0.8,
              }}
              transition={{
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Image with parallax layers */}
              <div className="relative w-full h-full">
                {/* Background image layer */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${activeSlide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: `translateZ(-20px) scale(1.1)`,
                  }}
                  animate={{
                    x: parallaxX * -0.5,
                    y: parallaxY * -0.5,
                  }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                />

                {/* Gradient overlays for depth */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#00AB39]/30 via-transparent to-[#1A1A1A]/50"
                  style={{ transform: 'translateZ(10px)' }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                  style={{ transform: 'translateZ(20px)' }}
                />

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/40 rounded-full backdrop-blur-sm"
                    style={{
                      left: `${10 + i * 12}%`,
                      top: `${20 + (i % 3) * 20}%`,
                      transform: `translateZ(${15 + i * 3}px)`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.3, 0.7, 0.3],
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}

                {/* Content card at bottom */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4 sm:p-6"
                  style={{ transform: 'translateZ(40px)' }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {/* Glass card */}
                  <div className="relative">
                    {/* Shadow */}
                    <div className="absolute inset-0 bg-black/30 blur-xl rounded-2xl transform translate-y-2" />

                    {/* Card background */}
                    <svg className="absolute inset-0 w-full h-full">
                      <rect
                        x="2"
                        y="2"
                        width="calc(100% - 4px)"
                        height="calc(100% - 4px)"
                        fill="white"
                        fillOpacity="0.95"
                        stroke="#1A1A1A"
                        strokeWidth="2.5"
                        rx="16"
                      />
                    </svg>

                    <div className="relative p-4 sm:p-5">
                      {/* Title */}
                      <motion.h3
                        className="text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mb-2"
                        style={{ fontFamily: 'Shadows Into Light, cursive' }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {activeSlide.title}
                      </motion.h3>

                      {/* Squiggle */}
                      <motion.svg
                        className="w-full h-1.5 mb-2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewBox="0 0 100 4"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,2 Q10,0 20,2 T40,2 T60,2 T80,2 T100,2"
                          stroke="#00AB39"
                          strokeWidth="2.5"
                          fill="none"
                        />
                      </motion.svg>

                      {/* Location and distance */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <motion.p
                          className="text-base sm:text-lg text-gray-700"
                          style={{ fontFamily: 'Patrick Hand, cursive' }}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          {activeSlide.location}
                        </motion.p>

                        <motion.div
                          className="flex items-center gap-1.5 relative"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          {/* Badge background */}
                          <svg className="absolute inset-0 w-full h-full -left-2 -right-2">
                            <rect
                              x="0"
                              y="0"
                              width="100%"
                              height="100%"
                              fill="#00AB39"
                              fillOpacity="0.1"
                              stroke="#00AB39"
                              strokeWidth="2"
                              rx="12"
                            />
                          </svg>

                          <MapPin
                            className="w-4 h-4 text-[#00AB39] relative z-10"
                            strokeWidth={2.5}
                          />
                          <span
                            className="text-sm sm:text-base text-[#00AB39] relative z-10 px-2"
                            style={{ fontFamily: 'Cabin Sketch, cursive' }}
                          >
                            {activeSlide.distance}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows with 3D effect */}
        <motion.button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 cursor-pointer"
          style={{ transform: 'translateZ(50px)' }}
          whileHover={{ scale: 1.15, x: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Shadow */}
          <div className="absolute inset-0 bg-black/30 blur-lg rounded-full transform translate-y-1" />

          <svg className="absolute inset-0 w-full h-full">
            <circle cx="50%" cy="50%" r="45%" fill="white" stroke="#1A1A1A" strokeWidth="3" />
            <circle
              cx="50%"
              cy="50%"
              r="35%"
              fill="none"
              stroke="#00AB39"
              strokeWidth="2"
              opacity="0.6"
            />
          </svg>
          <ChevronLeft
            className="relative w-7 h-7 sm:w-8 sm:h-8 text-[#00AB39] mx-auto"
            strokeWidth={3.5}
          />
        </motion.button>

        <motion.button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 cursor-pointer"
          style={{ transform: 'translateZ(50px)' }}
          whileHover={{ scale: 1.15, x: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Shadow */}
          <div className="absolute inset-0 bg-black/30 blur-lg rounded-full transform translate-y-1" />

          <svg className="absolute inset-0 w-full h-full">
            <circle cx="50%" cy="50%" r="45%" fill="white" stroke="#1A1A1A" strokeWidth="3" />
            <circle
              cx="50%"
              cy="50%"
              r="35%"
              fill="none"
              stroke="#00AB39"
              strokeWidth="2"
              opacity="0.6"
            />
          </svg>
          <ChevronRight
            className="relative w-7 h-7 sm:w-8 sm:h-8 text-[#00AB39] mx-auto"
            strokeWidth={3.5}
          />
        </motion.button>

        {/* Dots indicator with 3D */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-4 py-2 rounded-full"
          style={{ transform: 'translateZ(50px)' }}
        >
          {/* Background */}
          <svg className="absolute inset-0 w-full h-full">
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="white"
              fillOpacity="0.9"
              stroke="#1A1A1A"
              strokeWidth="2"
              rx="20"
            />
          </svg>

          {slides.map((_, i) => (
            <motion.div
              key={i}
              className="relative cursor-pointer w-3 h-3"
              onClick={() => setActiveIndex(i)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${i === activeIndex ? 'bg-[#00AB39] border-[#00AB39]' : 'bg-transparent border-[#00AB39]'}`}
                animate={{
                  scale: i === activeIndex ? 1.3 : 1,
                  borderWidth: i === activeIndex ? '3px' : '2px',
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Corner star decorations */}
        {[
          { top: '16px', left: '16px', rotate: 0 },
          { top: '16px', right: '16px', rotate: 90 },
          { bottom: '80px', left: '16px', rotate: -90 },
          { bottom: '80px', right: '16px', rotate: 180 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 z-50"
            style={{ ...pos, transform: 'translateZ(60px)' }}
            animate={{
              rotate: [pos.rotate, pos.rotate + 180, pos.rotate + 360],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z"
                fill="#00AB39"
                stroke="#1A1A1A"
                strokeWidth="1.5"
                opacity="0.9"
              />
            </svg>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
