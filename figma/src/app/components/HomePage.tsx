import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Bed, MapPin, Heart, Compass } from "lucide-react";
import logoImage from "figma:asset/6340c39809bbb6dce9c21e3fed2ac80a388b79b7.png";
import { VisualAreaShowcase } from "./VisualAreaShowcase";
import { useI18n } from "../contexts/I18nContext";
import { useAuth } from "../contexts/AuthContext";
import { Footer } from "./Footer";

// Sketchy button component
function SketchyButton({
  children,
  onClick,
  size = "md",
  emphasis = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  emphasis?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm md:text-base",
    lg: "px-8 py-3 text-base md:text-lg",
  };

  // More dramatic tilt for emphasized buttons
  const tiltAmount = emphasis ? -5 : -2;
  const hoverScale = emphasis ? 1.08 : 1.05;

  return (
    <motion.button
      className={`relative ${sizeClasses[size]} cursor-pointer overflow-visible`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{
        scale: hoverScale,
        rotateZ: tiltAmount,
        y: -4,
      }}
      whileTap={{ scale: 0.95 }}
      animate={
        emphasis
          ? {
              rotateZ: [0, -1, 1, -1, 0],
              y: [0, -2, 0],
            }
          : {}
      }
      transition={
        emphasis
          ? {
              rotateZ: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }
          : {}
      }
    >
      {/* Shadow */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: "blur(3px)" }}
        animate={
          isHovered
            ? { y: 6, opacity: 0.3 }
            : { y: 3, opacity: 0.15 }
        }
      >
        <rect
          x="3"
          y="3"
          width="calc(100% - 6px)"
          height="calc(100% - 6px)"
          fill="black"
          rx="10"
        />
      </motion.svg>

      {/* Button background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          fill="#00AB39"
          stroke="#1A1A1A"
          strokeWidth="2.5"
          rx="10"
          animate={
            isHovered
              ? { fill: "#00C843" }
              : { fill: "#00AB39" }
          }
        />
      </svg>

      <span
        className="relative z-10 text-white font-bold"
        style={{
          fontFamily: "Cabin Sketch, cursive",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </span>

      {/* Sparkles on hover */}
      {isHovered && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${25 + i * 20}%`,
                top: i % 2 === 0 ? "-3px" : "calc(100% + 3px)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: i % 2 === 0 ? [-8, 0] : [8, 0],
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                repeat: Infinity,
                repeatDelay: 0.4,
              }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
}

// Squiggle decoration
function Squiggle({ delay = 0 }: { delay?: number }) {
  return (
    <motion.svg
      className="w-full h-2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ duration: 1.5, delay }}
      viewBox="0 0 100 4"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M0,2 Q10,0 20,2 T40,2 T60,2 T80,2 T100,2"
        stroke="#00AB39"
        strokeWidth="2"
        fill="none"
      />
    </motion.svg>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax mouse tracking (desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || window.innerWidth < 768)
      return;
    const { innerWidth, innerHeight } = window;
    mouseX.set((e.clientX - innerWidth / 2) / 50);
    mouseY.set((e.clientY - innerHeight / 2) / 50);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () =>
      window.removeEventListener(
        "mousemove",
        handleGlobalMouseMove,
      );
  }, []);

  const { t } = useI18n();
  const { user } = useAuth();

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-gradient-to-br from-white via-[#f5f5f5] to-[#e8f5e9] relative overflow-x-hidden"
    >
      {/* Animated background doodles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 -z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle
                cx="15"
                cy="15"
                r="12"
                fill="none"
                stroke={i % 2 === 0 ? "#00AB39" : "#1A1A1A"}
                strokeWidth="2"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-50 px-4 sm:px-6 md:px-8 py-3 md:py-4 bg-white/80 backdrop-blur-md border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <motion.div
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.img
              src={logoImage}
              alt="Albergue"
              className="w-10 h-10 md:w-12 md:h-12"
              animate={{ rotate: [0, 4, -4, 0], y: [0, -2, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div>
              <h1
                className="text-base md:text-xl text-[#1A1A1A] leading-tight"
                style={{
                  fontFamily: "Shadows Into Light, cursive",
                }}
              >
                Albergue Municipal de El Carrascalejo
              </h1>
              <p
                className="text-xs text-gray-600"
                style={{ fontFamily: "Patrick Hand, cursive" }}
              >
                Camino de Santiago
              </p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start md:items-center">
          {/* Left - Hero Content */}
          <motion.div
            className="space-y-4 md:space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Icon */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart
                className="w-10 h-10 md:w-14 md:h-14 text-[#00AB39]"
                fill="#00AB39"
                strokeWidth={2.5}
              />
            </motion.div>

            {/* Title */}
            <div>
              <motion.h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1A1A1A] mb-2 relative inline-block"
                style={{
                  fontFamily: "Shadows Into Light, cursive",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ¡Bienvenido!
                {/* Underline */}
                <motion.svg
                  className="absolute -bottom-1 left-0 w-full h-2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewBox="0 0 100 4"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,2 Q25,0 50,2 T100,2"
                    stroke="#00AB39"
                    strokeWidth="3"
                    fill="none"
                  />
                </motion.svg>
              </motion.h2>

              <motion.h3
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#00AB39] mt-4"
                style={{ fontFamily: "Cabin Sketch, cursive" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Peregrino
              </motion.h3>
            </div>

            <Squiggle delay={0.6} />

            {/* Description */}
            <motion.p
              className="text-base md:text-lg text-gray-700 leading-relaxed max-w-xl"
              style={{ fontFamily: "Patrick Hand, cursive" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your resting place on the historic{" "}
              <span className="text-[#00AB39] font-bold">
                Vía de la Plata
              </span>{" "}
              route through Extremadura.
            </motion.p>

            {/* Compact Info Cards with permanent animations */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {[
                {
                  label: "Price",
                  value: "€10",
                  sublabel: "/night",
                },
                {
                  label: "Beds",
                  value: "24",
                  sublabel: "available",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="relative cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -5, 0],
                    rotateZ: [0, i === 0 ? -1.5 : 1.5, 0],
                  }}
                  transition={{
                    opacity: { delay: 0.7 + i * 0.1 },
                    scale: { delay: 0.7 + i * 0.1 },
                    y: {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    },
                    rotateZ: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    },
                  }}
                  whileHover={{ scale: 1.05, y: -7 }}
                >
                  {/* Shadow */}
                  <motion.svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ filter: "blur(2px)" }}
                    animate={{
                      y: [2, 4, 2],
                      opacity: [0.08, 0.12, 0.08],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                  >
                    <rect
                      x="2"
                      y="2"
                      width="calc(100% - 4px)"
                      height="calc(100% - 4px)"
                      fill="black"
                      rx="10"
                    />
                  </motion.svg>

                  {/* Card */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.rect
                      x="1.5"
                      y="1.5"
                      width="calc(100% - 3px)"
                      height="calc(100% - 3px)"
                      fill="white"
                      stroke="#1A1A1A"
                      strokeWidth="2"
                      rx="10"
                      animate={{
                        stroke: [
                          "#1A1A1A",
                          "#00AB39",
                          "#1A1A1A",
                        ],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5,
                      }}
                    />
                  </svg>

                  <div className="relative z-10 px-4 py-2.5 text-center min-w-[90px]">
                    <p
                      className="text-xs text-gray-500 uppercase tracking-wide"
                      style={{
                        fontFamily: "Cabin Sketch, cursive",
                      }}
                    >
                      {item.label}
                    </p>
                    <motion.p
                      className="text-2xl md:text-3xl text-[#00AB39] my-0.5"
                      style={{
                        fontFamily:
                          "Shadows Into Light, cursive",
                      }}
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.6,
                      }}
                    >
                      {item.value}
                    </motion.p>
                    <p
                      className="text-xs text-gray-400"
                      style={{
                        fontFamily: "Patrick Hand, cursive",
                      }}
                    >
                      {item.sublabel}
                    </p>
                  </div>

                  {/* Pulsing dot */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00AB39] rounded-full"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="pt-3 relative z-20"
            >
              <SketchyButton
                onClick={() => navigate("/book")}
                size="lg"
                emphasis={true}
              >
                Start Booking Now
              </SketchyButton>
            </motion.div>

            {/* Features */}
            <motion.div
              className="space-y-2.5 pt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[
                {
                  icon: Bed,
                  text: "2 dormitories with 12 beds each",
                },
                {
                  icon: MapPin,
                  text: "Historic Camino route location",
                },
                {
                  icon: Compass,
                  text: "Modern facilities, warm hospitality",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2.5"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  whileHover={{ x: 3 }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-full bg-[#00AB39]/10 flex items-center justify-center flex-shrink-0"
                    whileHover={{
                      scale: 1.15,
                      rotate: 360,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                    }}
                  >
                    <item.icon
                      className="w-4 h-4 text-[#00AB39]"
                      strokeWidth={2.5}
                    />
                  </motion.div>
                  <p
                    className="text-sm md:text-base text-gray-700"
                    style={{
                      fontFamily: "Patrick Hand, cursive",
                    }}
                  >
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            {/* "Tell me more" button above carousel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center mb-4"
            >
              <SketchyButton onClick={() => {}} size="md">
                Tell me more... ✨
              </SketchyButton>
            </motion.div>

            {/* Carousel */}
            <VisualAreaShowcase />
          </motion.div>
        </div>
      </main>

      {/* Footer info */}
      <Footer />
    </div>
  );
}