import { motion } from "motion/react";
import { ReactNode } from "react";

interface DoodleBadgeProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function DoodleBadge({
  children,
  color = "#00AB39",
  className = "",
}: DoodleBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative inline-block ${className}`}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        <ellipse
          cx="50%"
          cy="50%"
          rx="48%"
          ry="45%"
          fill="white"
          stroke={color}
          strokeWidth="2.5"
          style={{
            filter: "drop-shadow(1px 2px 1px rgba(0,0,0,0.1))",
          }}
        />
        <ellipse
          cx="50%"
          cy="50%"
          rx="46%"
          ry="43%"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.3"
          style={{
            strokeDasharray: "3, 3",
          }}
        />
      </svg>
      <span
        className="relative z-10 px-4 py-2 inline-block font-medium text-sm"
        style={{ color }}
      >
        {children}
      </span>
    </motion.div>
  );
}
