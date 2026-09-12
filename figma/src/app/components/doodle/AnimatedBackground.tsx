import { motion } from 'motion/react';

export function AnimatedBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.15 }}
    >
      <defs>
        {/* Sketch filter for organic feel */}
        <filter id="sketch">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </defs>

      {/* Animated Sun */}
      <motion.g
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 120, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ originX: '150px', originY: '150px' }}
      >
        <circle
          cx="150"
          cy="150"
          r="60"
          fill="none"
          stroke="#EAC102"
          strokeWidth="4"
          filter="url(#sketch)"
        />
        <circle
          cx="150"
          cy="150"
          r="50"
          fill="none"
          stroke="#EAC102"
          strokeWidth="3"
          opacity="0.6"
          strokeDasharray="5, 5"
        />
        {/* Sun rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <motion.line
            key={angle}
            x1="150"
            y1="80"
            x2="150"
            y2="50"
            stroke="#EAC102"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 150 150)`}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: angle / 100 }}
          />
        ))}
      </motion.g>

      {/* Flying Birds - Multiple groups */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.g
          key={`bird-${i}`}
          animate={{
            x: [-100, 2000],
            y: [200 + i * 80, 150 + i * 80, 200 + i * 80]
          }}
          transition={{
            x: { duration: 40 + i * 10, repeat: Infinity, ease: "linear" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <motion.path
            d="M0,0 Q-10,-8 -20,0 Q-10,2 0,0 Q10,2 20,0 Q10,-8 0,0"
            fill="none"
            stroke="#5D4E37"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ 
              d: [
                "M0,0 Q-10,-8 -20,0 Q-10,2 0,0 Q10,2 20,0 Q10,-8 0,0",
                "M0,0 Q-10,-12 -20,-2 Q-10,0 0,0 Q10,0 20,-2 Q10,-12 0,0",
                "M0,0 Q-10,-8 -20,0 Q-10,2 0,0 Q10,2 20,0 Q10,-8 0,0"
              ]
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </motion.g>
      ))}

      {/* Floating Clouds */}
      {[0, 1, 2, 3].map((i) => (
        <motion.g
          key={`cloud-${i}`}
          animate={{
            x: [-200, 2100],
          }}
          transition={{
            duration: 60 + i * 15,
            repeat: Infinity,
            ease: "linear",
            delay: i * 5
          }}
        >
          <motion.path
            d={`M${300 + i * 400},${250 + i * 100} q20,-15 40,-10 q15,-20 40,-15 q20,-10 40,5 q-5,20 -20,25 q-15,15 -40,15 q-20,10 -45,5 q-20,-5 -15,-25 z`}
            fill="white"
            stroke="#5D4E37"
            strokeWidth="2.5"
            filter="url(#sketch)"
            opacity="0.7"
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>
      ))}

      {/* Mountains - Background */}
      <motion.g
        animate={{ 
          x: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,700 L300,500 L500,600 L700,450 L900,550 L1200,400 L1500,500 L1800,450 L2000,550 L2000,1080 L0,1080 Z"
          fill="#8B956D"
          opacity="0.3"
          stroke="#5D4E37"
          strokeWidth="3"
          filter="url(#sketch)"
        />
      </motion.g>

      {/* Trees - Swaying */}
      {[200, 450, 700, 950, 1200, 1450, 1700].map((x, i) => (
        <motion.g
          key={`tree-${i}`}
          animate={{
            rotate: [0, 2, 0, -2, 0],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
          style={{ originX: `${x}px`, originY: '900px' }}
        >
          {/* Tree trunk */}
          <rect
            x={x - 8}
            y="850"
            width="16"
            height="100"
            fill="#8B7355"
            stroke="#5D4E37"
            strokeWidth="2"
            filter="url(#sketch)"
          />
          {/* Tree foliage - organic blob */}
          <motion.ellipse
            cx={x}
            cy="820"
            rx="50"
            ry="60"
            fill="#00AB39"
            stroke="#005a1e"
            strokeWidth="3"
            filter="url(#sketch)"
            opacity="0.8"
            animate={{ 
              rx: [50, 55, 50],
              ry: [60, 65, 60]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
          <motion.ellipse
            cx={x - 20}
            cy="810"
            rx="35"
            ry="40"
            fill="#00AB39"
            stroke="#005a1e"
            strokeWidth="2"
            filter="url(#sketch)"
            opacity="0.7"
          />
          <motion.ellipse
            cx={x + 20}
            cy="810"
            rx="35"
            ry="40"
            fill="#00AB39"
            stroke="#005a1e"
            strokeWidth="2"
            filter="url(#sketch)"
            opacity="0.7"
          />
        </motion.g>
      ))}

      {/* Camino Path - Winding */}
      <motion.path
        d="M0,950 Q400,920 800,950 T1600,950 L1920,950 L1920,1080 L0,1080 Z"
        fill="#D4A574"
        stroke="#5D4E37"
        strokeWidth="3"
        strokeDasharray="10, 5"
        filter="url(#sketch)"
        opacity="0.4"
        animate={{ 
          d: [
            "M0,950 Q400,920 800,950 T1600,950 L1920,950 L1920,1080 L0,1080 Z",
            "M0,950 Q400,940 800,930 T1600,950 L1920,950 L1920,1080 L0,1080 Z",
            "M0,950 Q400,920 800,950 T1600,950 L1920,950 L1920,1080 L0,1080 Z"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grass patches */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.line
          key={`grass-${i}`}
          x1={i * 70}
          y1="950"
          x2={i * 70}
          y2="930"
          stroke="#8B956D"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ 
            y2: [930, 920, 930],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 2 + (i % 5) * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1
          }}
        />
      ))}

      {/* Butterflies */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={`butterfly-${i}`}
          animate={{
            x: [100 + i * 600, 200 + i * 600, 300 + i * 600, 200 + i * 600, 100 + i * 600],
            y: [400 + i * 150, 350 + i * 150, 400 + i * 150, 450 + i * 150, 400 + i * 150],
            rotate: [0, 10, -10, 5, 0]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.path
            d="M0,0 Q-5,-8 -10,-5 Q-8,-2 -5,0 Q-8,2 -10,5 Q-5,8 0,0"
            fill="#EAC102"
            stroke="#5D4E37"
            strokeWidth="1.5"
            animate={{ 
              scaleX: [1, 1.3, 1],
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          <motion.path
            d="M0,0 Q5,-8 10,-5 Q8,-2 5,0 Q8,2 10,5 Q5,8 0,0"
            fill="#EAC102"
            stroke="#5D4E37"
            strokeWidth="1.5"
            animate={{ 
              scaleX: [1, 1.3, 1],
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        </motion.g>
      ))}

      {/* Wildflowers */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.g
          key={`flower-${i}`}
          animate={{
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2
          }}
          style={{ originX: `${150 + i * 120}px`, originY: '920px' }}
        >
          <line
            x1={150 + i * 120}
            y1="920"
            x2={150 + i * 120}
            y2="890"
            stroke="#8B956D"
            strokeWidth="2"
          />
          <circle
            cx={150 + i * 120}
            cy="885"
            r="5"
            fill={i % 3 === 0 ? "#ED1C24" : i % 3 === 1 ? "#EAC102" : "#00AB39"}
            stroke="#5D4E37"
            strokeWidth="1.5"
          />
        </motion.g>
      ))}
    </svg>
  );
}
