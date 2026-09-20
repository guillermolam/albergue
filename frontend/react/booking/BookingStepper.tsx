import { motion } from 'motion/react';
import {
  CalendarIcon as Calendar,
  CreditCardIcon as CreditCard,
  FileTextIcon as FileText,
  BedIcon as Bed,
  UserIcon as User,
  UploadIcon as Upload,
  CheckCircleIcon as CheckCircle,
  HomeIcon as Home,
} from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';

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

export function BookingStepper({ currentStep, completedSteps, onStepClick }: BookingStepperProps) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';

  const steps: Step[] = [
    {
      number: 1,
      title: isEs ? 'Fechas' : 'Dates',
      subtitle: isEs ? 'Entrada y salida' : 'Check-in & out',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      number: 2,
      title: isEs ? 'Documento' : 'ID Upload',
      subtitle: isEs ? 'Escaneo OCR' : 'OCR scan',
      icon: <Upload className="w-5 h-5" />,
    },
    {
      number: 3,
      title: isEs ? 'Tus Datos' : 'Your Info',
      subtitle: isEs ? 'Datos del peregrino' : 'Pilgrim details',
      icon: <User className="w-5 h-5" />,
    },
    {
      number: 4,
      title: isEs ? 'Elegir Cama' : 'Select Bed',
      subtitle: isEs ? 'Vista del dormitorio' : '3D dorm view',
      icon: <Bed className="w-5 h-5" />,
    },
    {
      number: 5,
      title: isEs ? 'Pago' : 'Payment',
      subtitle: isEs ? 'Pago seguro' : 'Secure checkout',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      number: 6,
      title: isEs ? 'Resumen' : 'Summary',
      subtitle: isEs ? 'Revisar reserva' : 'Review booking',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      number: 7,
      title: isEs ? 'Panel' : 'Dashboard',
      subtitle: isEs ? 'Tu portal' : 'Your portal',
      icon: <Home className="w-5 h-5" />,
    },
  ];

  const isStepClickable = (stepNumber: number) =>
    stepNumber < currentStep || completedSteps.includes(stepNumber);
  const isStepCompleted = (stepNumber: number) => completedSteps.includes(stepNumber);

  return (
    <div className="relative">
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
                className={`flex items-center gap-4 w-full text-left transition-all ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="relative z-10">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle
                      cx="30"
                      cy="30"
                      r="26"
                      fill={isActive ? '#00AB39' : isCompleted ? '#0071BC' : '#FFFFFF'}
                      stroke={isActive ? '#005a1e' : isCompleted ? '#003d66' : '#D4A574'}
                      strokeWidth={isActive ? '3.5' : '2.5'}
                    />
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

                  <div
                    className={`absolute inset-0 flex items-center justify-center ${isActive || isCompleted ? 'text-white' : isPast ? 'text-gray-400' : 'text-[#5D4E37]'}`}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      step.icon
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-xs font-medium uppercase tracking-wider ${isActive ? 'text-[#00AB39]' : isPast ? 'text-gray-400' : 'text-gray-500'}`}
                      style={{ fontFamily: 'Cabin Sketch, cursive' }}
                    >
                      {isEs ? 'Paso' : 'Step'} {step.number}
                    </span>
                  </div>
                  <p
                    className={`text-lg font-medium transition-colors ${isActive ? 'text-[#5D4E37] sketch-title' : isPast ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-400'}`}
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                  >
                    {step.subtitle}
                  </p>
                </div>

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
