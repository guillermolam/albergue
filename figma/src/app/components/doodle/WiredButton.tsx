import { motion } from "motion/react";
import { ReactNode } from "react";

interface WiredButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function WiredButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}: WiredButtonProps) {
  const colors = {
    primary: { bg: "#00AB39", stroke: "#00AB39", text: "white" },
    secondary: { bg: "#FFF9F0", stroke: "#5D4E37", text: "#5D4E37" },
    outline: { bg: "transparent", stroke: "#00AB39", text: "#00AB39" },
  };

  const sizes = {
    sm: { px: 16, py: 8, text: "text-sm" },
    md: { px: 24, py: 12, text: "text-base" },
    lg: { px: 32, py: 16, text: "text-lg" },
  };

  const colorScheme = colors[variant];
  const sizeScheme = sizes[size];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05, rotate: -1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`relative ${sizeScheme.text} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      style={{
        padding: `${sizeScheme.py}px ${sizeScheme.px}px`,
      }}
    >
      {/* Hand-drawn button background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: "drop-shadow(2px 3px 2px rgba(0,0,0,0.15))" }}
      >
        <defs>
          <filter id="roughness">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>

        {/* Main button shape */}
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          fill={colorScheme.bg}
          stroke={colorScheme.stroke}
          strokeWidth="2.5"
          rx="8"
          ry="8"
          filter="url(#roughness)"
          style={{
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />

        {/* Sketchy overlay lines */}
        <rect
          x="3"
          y="3"
          width="calc(100% - 6px)"
          height="calc(100% - 6px)"
          fill="none"
          stroke={colorScheme.stroke}
          strokeWidth="2"
          rx="7"
          ry="7"
          opacity="0.3"
          style={{
            strokeDasharray: "4, 4",
            strokeLinecap: "round",
          }}
        />
      </svg>

      {/* Button text */}
      <span
        className="relative z-10 font-medium"
        style={{ color: colorScheme.text }}
      >
        {children}
      </span>

      {/* Decorative doodle accent */}
      {!disabled && (
        <motion.svg
          className="absolute -top-1 -right-1 w-4 h-4 pointer-events-none"
          style={{ color: colorScheme.stroke }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M1,2 L3,2 M2,1 L2,3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.svg>
      )}
    </motion.button>
  );
}
