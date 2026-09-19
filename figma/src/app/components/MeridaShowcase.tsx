import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { MapPin, Church, Sun, Camera } from "lucide-react";
import exampleImage from "figma:asset/9b0a59c4c51a4ee7b0b2141f208e5f194127acda.png";

export function MeridaShowcase() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 5,
        y: (e.clientY / window.innerHeight - 0.5) * 5,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const infoCards = [
    { icon: Church, text: "Teatro Romano" },
    { icon: MapPin, text: "UNESCO Site" },
    { icon: Sun, text: "Via de la Plata" },
    { icon: Camera, text: "Founded 25 BC" },
  ];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#FFF9F0] via-[#E8F5E9] to-[#F5F5F5] overflow-hidden relative flex items-center justify-center p-4">
      {/* Background floating shapes - fewer and smaller */}
      {[...Array(8)].map((_, i) => {
        const size = 20 + Math.random() * 40;
        const left = Math.random() * 100;
        const top = Math.random() * 100;

        return (
          <motion.div
            key={`bg-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              backgroundColor: i % 2 === 0 ? "#00AB39" : "#E8F5E9",
            }}
            animate={{
              x: [0, Math.random() * 30 - 15, 0],
              y: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        );
      })}

      {/* Main Compact Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center gap-4">
        {/* Title + Subtitle */}
        <motion.div
          className="text-center"
          style={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
          animate={{ rotate: [0, 0.5, -0.5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <h1
            className="text-6xl text-[#00AB39] sketch-title leading-none"
            style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.1)" }}
          >
            Mérida
          </h1>
          <p className="text-lg text-[#4A4A4A] hand-drawn mt-2">
            ✨ Ancient Roman City • Camino de Santiago ✨
          </p>
        </motion.div>

        {/* Main Content Row */}
        <div className="flex items-center justify-center gap-6 w-full">
          {/* Left Words */}
          <div className="flex flex-col gap-3">
            {["Augusta", "Emerita", "Extremadura"].map((word, i) => (
              <motion.div
                key={word}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 4, -4, 0],
                }}
                transition={{
                  duration: 3 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              >
                <motion.div
                  className="bg-white px-3 py-1 doodle-border border-2 border-[#00AB39] doodle-shadow-sm inline-block"
                  whileHover={{ scale: 1.1, rotate: 3 }}
                >
                  <span className="text-sm text-[#00AB39] sketch-title">
                    {word}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Center Image */}
          <motion.div
            className="relative w-80 h-64 flex-shrink-0"
            animate={{ y: [0, -10, 0], rotate: [0, 0.3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={exampleImage}
              alt="Mérida"
              className="w-full h-full object-cover doodle-radius-lg doodle-shadow-lg"
            />

            {/* Floating badge */}
            <motion.div
              className="absolute -top-4 -right-4 w-16 h-16 bg-[#00AB39] rounded-full flex items-center justify-center glow-green-strong doodle-shadow-md"
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <span className="text-2xl">🏛️</span>
            </motion.div>
          </motion.div>

          {/* Right Info Cards */}
          <div className="flex flex-col gap-2">
            {infoCards.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  animate={{
                    x: [0, 8, 0],
                    rotate: [0, 2, 0],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                >
                  <motion.div
                    className="bg-white p-2 doodle-radius border-2 border-[#00AB39] doodle-shadow-sm flex items-center gap-2 cursor-pointer w-48"
                    whileHover={{ scale: 1.05, rotate: 2, zIndex: 50 }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-full bg-[#00AB39] flex items-center justify-center flex-shrink-0"
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 6 + i,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <span
                      className="text-xs"
                      style={{ fontFamily: "Patrick Hand, cursive" }}
                    >
                      {item.text}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Row - Notes + Circles + CTA */}
        <div className="flex items-center justify-center gap-4 w-full mt-2">
          {/* Left Note */}
          <motion.div
            animate={{ x: [-8, 8, -8], rotate: [-3, 3, -3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-[#FFF9E6] p-2 doodle-border border-2 border-[#4A4A4A] doodle-shadow transform rotate-2">
              <p className="hand-drawn text-xs text-[#4A4A4A]">
                Walk ancient
                <br />
                Roman streets
              </p>
            </div>
          </motion.div>

          {/* Bouncing Circles */}
          <div className="flex gap-2">
            {["🌟", "🎭", "⚔️", "🏺", "🌿", "☀️"].map((emoji, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2.5 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full border-2 border-[#00AB39] bg-white flex items-center justify-center cursor-pointer doodle-shadow-sm"
                  whileHover={{ scale: 1.3, backgroundColor: "#00AB39" }}
                >
                  <span className="text-sm">{emoji}</span>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Right Note */}
          <motion.div
            animate={{ x: [8, -8, 8], rotate: [2, -2, 2] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <div className="bg-[#E8F5E9] p-2 doodle-radius border-2 border-[#00AB39] doodle-shadow transform -rotate-1">
              <p className="sketch-title text-xs text-[#00AB39]">
                World
                <br />
                Heritage ✨
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.button
              className="px-6 py-3 bg-[#00AB39] text-white doodle-radius border-2 border-[#006b24] doodle-shadow-lg glow-green-strong"
              whileHover={{
                scale: 1.1,
                rotate: 2,
                boxShadow: "0 0 30px rgba(0, 171, 57, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sketch-title text-lg">Explore! 🏛️</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
