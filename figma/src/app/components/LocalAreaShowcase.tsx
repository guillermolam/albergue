import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Mountain,
  Landmark,
  Trees,
  Sun,
  Compass,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { unsplash_tool } from "../tools";

interface LocalSpot {
  name: string;
  distance: string;
  type: "nature" | "historic" | "town" | "camino";
  description: string;
  icon: any;
  image?: string;
}

const localSpots: LocalSpot[] = [
  {
    name: "Vía de la Plata",
    distance: "0 km",
    type: "camino",
    description:
      "Ancient Roman road, now a major Camino de Santiago route through Extremadura",
    icon: Compass,
  },
  {
    name: "Mérida",
    distance: "35 km",
    type: "historic",
    description:
      "UNESCO World Heritage Site with spectacular Roman ruins and amphitheater",
    icon: Landmark,
  },
  {
    name: "Montánchez",
    distance: "18 km",
    type: "town",
    description:
      "Historic medieval town famous for Iberian ham and stunning mountain views",
    icon: Mountain,
  },
  {
    name: "Sierra de Montánchez",
    distance: "12 km",
    type: "nature",
    description:
      "Protected natural park with oak forests, hiking trails, and wildlife",
    icon: Trees,
  },
  {
    name: "Cáceres",
    distance: "42 km",
    type: "historic",
    description:
      "Medieval walled city, UNESCO World Heritage Site, Game of Thrones filming location",
    icon: Landmark,
  },
];

export function LocalAreaShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState<Record<number, string>>({});
  const [direction, setDirection] = useState(0);

  const activeSpot = localSpots[activeIndex];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % localSpots.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % localSpots.length);
  };

  const goToPrev = () => {
    setDirection(-1);
    setActiveIndex(
      (prev) => (prev - 1 + localSpots.length) % localSpots.length,
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "camino":
        return "#00AB39";
      case "historic":
        return "#8B4513";
      case "town":
        return "#4A90E2";
      case "nature":
        return "#2E7D32";
      default:
        return "#00AB39";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "camino":
        return "Camino Route";
      case "historic":
        return "Historic Site";
      case "town":
        return "Town";
      case "nature":
        return "Nature";
      default:
        return type;
    }
  };

  return (
    <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px]">
      {/* Shadow */}
      <div className="absolute inset-0 bg-black/10 blur-xl rounded-3xl transform translate-y-3" />

      {/* Main container with doodle border */}
      <div className="relative h-full">
        {/* Border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
          <rect
            x="3"
            y="3"
            width="calc(100% - 6px)"
            height="calc(100% - 6px)"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="3"
            rx="20"
          />
          <rect
            x="6"
            y="6"
            width="calc(100% - 12px)"
            height="calc(100% - 12px)"
            fill="none"
            stroke="#00AB39"
            strokeWidth="1.5"
            rx="17"
            opacity="0.6"
            strokeDasharray="6, 6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="60s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>

        {/* Content */}
        <div className="absolute inset-3 rounded-2xl overflow-hidden bg-gradient-to-br from-[#e8f5e9] to-white">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Image background with gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00AB39]/20 via-transparent to-[#1A1A1A]/30" />

              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full">
                  <defs>
                    <pattern
                      id={`dots-${activeIndex}`}
                      x="0"
                      y="0"
                      width="30"
                      height="30"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="15" cy="15" r="2" fill="#00AB39" />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#dots-${activeIndex})`}
                  />
                </svg>
              </div>

              {/* Top section - Icon and type badge */}
              <div className="relative z-10 p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center relative"
                    >
                      {/* Shadow */}
                      <div className="absolute inset-0 bg-black/20 blur-md rounded-full transform translate-y-1" />

                      {/* Background */}
                      <svg className="absolute inset-0 w-full h-full">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="white"
                          stroke="#1A1A1A"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="40%"
                          fill="none"
                          stroke={getTypeColor(activeSpot.type)}
                          strokeWidth="2"
                          opacity="0.6"
                        />
                      </svg>

                      <activeSpot.icon
                        className="relative z-10 w-7 h-7 sm:w-8 sm:h-8"
                        style={{ color: getTypeColor(activeSpot.type) }}
                        strokeWidth={2.5}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Type badge */}
                  <motion.div
                    initial={{ scale: 0, x: 20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="relative"
                  >
                    <svg className="absolute inset-0 w-full h-full">
                      <rect
                        x="1"
                        y="1"
                        width="calc(100% - 2px)"
                        height="calc(100% - 2px)"
                        fill="white"
                        stroke="#1A1A1A"
                        strokeWidth="2"
                        rx="12"
                      />
                    </svg>
                    <div className="relative px-3 py-1.5">
                      <p
                        className="text-xs sm:text-sm uppercase tracking-wide"
                        style={{
                          fontFamily: "Cabin Sketch, cursive",
                          color: getTypeColor(activeSpot.type),
                        }}
                      >
                        {getTypeLabel(activeSpot.type)}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Middle section - Big rotating icon */}
              <div className="relative flex-1 flex items-center justify-center">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 opacity-10"
                >
                  <activeSpot.icon
                    className="w-full h-full"
                    style={{ color: getTypeColor(activeSpot.type) }}
                  />
                </motion.div>
              </div>

              {/* Bottom section - Info */}
              <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-white/95 to-transparent backdrop-blur-sm">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  {/* Name and distance */}
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A]"
                      style={{ fontFamily: "Shadows Into Light, cursive" }}
                    >
                      {activeSpot.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <MapPin
                        className="w-4 h-4 text-[#00AB39]"
                        strokeWidth={2.5}
                      />
                      <span
                        className="text-lg sm:text-xl text-[#00AB39]"
                        style={{ fontFamily: "Cabin Sketch, cursive" }}
                      >
                        {activeSpot.distance}
                      </span>
                    </div>
                  </div>

                  {/* Squiggle divider */}
                  <motion.svg
                    className="w-full h-1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewBox="0 0 100 4"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,2 Q10,0 20,2 T40,2 T60,2 T80,2 T100,2"
                      stroke={getTypeColor(activeSpot.type)}
                      strokeWidth="2"
                      fill="none"
                    />
                  </motion.svg>

                  {/* Description */}
                  <p
                    className="text-sm sm:text-base text-gray-700 leading-relaxed"
                    style={{ fontFamily: "Patrick Hand, cursive" }}
                  >
                    {activeSpot.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <motion.button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 cursor-pointer"
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="absolute inset-0 w-full h-full">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="white"
                stroke="#1A1A1A"
                strokeWidth="2.5"
              />
            </svg>
            <ChevronLeft
              className="relative w-6 h-6 sm:w-7 sm:h-7 text-[#00AB39] mx-auto"
              strokeWidth={3}
            />
          </motion.button>

          <motion.button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 cursor-pointer"
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="absolute inset-0 w-full h-full">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="white"
                stroke="#1A1A1A"
                strokeWidth="2.5"
              />
            </svg>
            <ChevronRight
              className="relative w-6 h-6 sm:w-7 sm:h-7 text-[#00AB39] mx-auto"
              strokeWidth={3}
            />
          </motion.button>

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {localSpots.map((_, i) => (
              <motion.div
                key={i}
                className="relative cursor-pointer w-3 h-3"
                onClick={() => setActiveIndex(i)}
                whileHover={{ scale: 1.15 }}
              >
                {/* Active indicator - filled when active */}
                <motion.div
                  className={`w-3 h-3 rounded-full border-2 ${i === activeIndex ? "bg-[#00AB39] border-[#00AB39]" : "bg-transparent border-[#00AB39]"}`}
                  animate={{
                    scale: i === activeIndex ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Corner decorations */}
        {[
          { top: "10px", left: "10px", rotate: 0 },
          { top: "10px", right: "10px", rotate: 90 },
          { bottom: "10px", left: "10px", rotate: -90 },
          { bottom: "10px", right: "10px", rotate: 180 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-5 h-5 z-40"
            style={pos}
            animate={{
              rotate: [pos.rotate, pos.rotate + 8, pos.rotate],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M2,2 L6,2 M2,2 L2,6"
                stroke="#00AB39"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
