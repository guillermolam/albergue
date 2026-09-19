import { motion } from "motion/react";
import {
  Calendar,
  CreditCard,
  FileText,
  Bed,
  User,
  Upload,
  CheckCircle,
  Home,
} from "lucide-react";

interface Step {
  number: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface BookingStepperProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export function BookingStepper({
  currentStep,
  completedSteps,
  onStepClick,
}: BookingStepperProps) {
  const steps: Step[] = [
    {
      number: 1,
      title: "Dates",
      subtitle: "Check-in & out",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      number: 2,
      title: "ID Upload",
      subtitle: "OCR scan",
      icon: <Upload className="w-5 h-5" />,
    },
    {
      number: 3,
      title: "Your Info",
      subtitle: "Pilgrim details",
      icon: <User className="w-5 h-5" />,
    },
    {
      number: 4,
      title: "Select Bed",
      subtitle: "3D dorm view",
      icon: <Bed className="w-5 h-5" />,
    },
    {
      number: 5,
      title: "Payment",
      subtitle: "Secure checkout",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      number: 6,
      title: "Summary",
      subtitle: "Review booking",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      number: 7,
      title: "Dashboard",
      subtitle: "Your portal",
      icon: <Home className="w-5 h-5" />,
    },
  ];

  const isStepClickable = (stepNumber: number) => {
    return stepNumber < currentStep || completedSteps.includes(stepNumber);
  };

  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber);
  };

  return (
    <div className="relative">
      {/* Vertical connecting line */}
      <div className="absolute left-[30px] top-[40px] bottom-[40px] w-1">
        <svg className="w-full h-full">
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
            stroke="#D4A574"
            strokeWidth="2.5"
            strokeDasharray="6, 6"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = isStepCompleted(step.number);
          const isClickable = isStepClickable(step.number);
          const isPast = step.number < currentStep;

          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <motion.button
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                whileHover={isClickable ? { x: 4, scale: 1.02 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
                className={`flex items-center gap-4 w-full text-left transition-all ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                {/* Step Circle */}
                <div className="relative z-10">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    {/* Outer circle */}
                    <circle
                      cx="30"
                      cy="30"
                      r="26"
                      fill={
                        isActive
                          ? "#00AB39"
                          : isCompleted
                            ? "#0071BC"
                            : "#FFF9F0"
                      }
                      stroke={
                        isActive
                          ? "#005a1e"
                          : isCompleted
                            ? "#003d66"
                            : "#D4A574"
                      }
                      strokeWidth={isActive ? "3.5" : "2.5"}
                    />
                    {/* Inner dashed circle */}
                    {isActive && (
                      <circle
                        cx="30"
                        cy="30"
                        r="22"
                        fill="none"
                        stroke="#005a1e"
                        strokeWidth="2"
                        strokeDasharray="4, 4"
                        opacity="0.3"
                      />
                    )}
                  </svg>

                  {/* Icon or checkmark */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      isActive || isCompleted
                        ? "text-white"
                        : isPast
                          ? "text-gray-400"
                          : "text-[#5D4E37]"
                    }`}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      step.icon
                    )}
                  </div>
                </div>

                {/* Step Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-xs font-medium uppercase tracking-wider ${
                        isActive
                          ? "text-[#00AB39]"
                          : isPast
                            ? "text-gray-400"
                            : "text-gray-500"
                      }`}
                      style={{ fontFamily: "Cabin Sketch, cursive" }}
                    >
                      Step {step.number}
                    </span>
                  </div>
                  <p
                    className={`text-lg font-medium transition-colors ${
                      isActive
                        ? "text-[#5D4E37] sketch-title"
                        : isPast
                          ? "text-gray-500"
                          : "text-gray-600"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-sm ${
                      isActive ? "text-gray-600" : "text-gray-400"
                    }`}
                    style={{ fontFamily: "Patrick Hand, cursive" }}
                  >
                    {step.subtitle}
                  </p>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-[#00AB39]"
                  />
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
