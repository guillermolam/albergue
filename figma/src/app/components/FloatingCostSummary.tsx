import { motion, AnimatePresence } from "motion/react";
import { Calendar, Bed, Moon, Euro } from "lucide-react";
import logoImage from "figma:asset/6340c39809bbb6dce9c21e3fed2ac80a388b79b7.png";

interface FloatingCostSummaryProps {
  checkInDate?: Date;
  checkOutDate?: Date;
  selectedBeds: number;
  pricePerNight?: number;
}

export function FloatingCostSummary({
  checkInDate,
  checkOutDate,
  selectedBeds,
  pricePerNight = 10,
}: FloatingCostSummaryProps) {
  const nights =
    checkInDate && checkOutDate
      ? Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 1;

  const subtotal = selectedBeds * pricePerNight * nights;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      className="fixed top-24 right-8 z-40 hidden lg:block"
      whileHover={{ scale: 1.02, rotate: -1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Hand-drawn floating card */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: "drop-shadow(4px 6px 8px rgba(0,0,0,0.15))" }}
      >
        <rect
          x="4"
          y="4"
          width="calc(100% - 8px)"
          height="calc(100% - 8px)"
          fill="#FFF9F0"
          stroke="#00AB39"
          strokeWidth="3.5"
          rx="20"
          style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
        />
        <rect
          x="6"
          y="6"
          width="calc(100% - 12px)"
          height="calc(100% - 12px)"
          fill="none"
          stroke="#00AB39"
          strokeWidth="2.5"
          rx="18"
          opacity="0.3"
          strokeDasharray="6, 6"
        />
      </svg>

      <div className="relative z-10 p-6 w-80 paper-texture">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-dashed border-[#00AB39]/30">
          <motion.img
            src={logoImage}
            alt="Albergue Carrascalejo"
            className="w-12 h-12"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div>
            <h3 className="sketch-title text-lg text-[#00AB39]">
              Your Booking
            </h3>
            <p className="text-xs text-gray-500 hand-drawn">~ Carrascalejo ~</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-4">
          {/* Dates */}
          <AnimatePresence>
            {checkInDate && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3"
              >
                <Calendar className="w-5 h-5 text-[#0071BC] mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-medium text-[#5D4E37]">
                    {checkInDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  {checkOutDate && (
                    <>
                      <p className="text-sm text-gray-600 mt-2">Check-out</p>
                      <p className="font-medium text-[#5D4E37]">
                        {checkOutDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Beds */}
          <AnimatePresence>
            {selectedBeds > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                <Bed className="w-5 h-5 text-[#00AB39] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Beds selected</p>
                  <p className="font-medium text-[#5D4E37]">
                    {selectedBeds} bed{selectedBeds > 1 ? "s" : ""}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nights */}
          <AnimatePresence>
            {checkInDate && checkOutDate && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                <Moon className="w-5 h-5 text-[#EAC102] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Nights</p>
                  <p className="font-medium text-[#5D4E37]">
                    {nights} night{nights > 1 ? "s" : ""}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cost Breakdown */}
        <AnimatePresence>
          {selectedBeds > 0 && checkInDate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 pt-4 border-t-2 border-dashed border-[#00AB39]/30 space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {selectedBeds} × {nights} night{nights > 1 ? "s" : ""} × €
                  {pricePerNight}
                </span>
                <span className="font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">€{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="font-semibold text-[#5D4E37] flex items-center gap-1">
                  <Euro className="w-4 h-4" />
                  Total
                </span>
                <span className="text-2xl font-bold text-[#00AB39] sketch-title">
                  €{total.toFixed(2)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative doodles */}
        <svg className="absolute -top-3 -left-3 w-8 h-8 pointer-events-none opacity-60">
          <motion.path
            d="M4,4 Q8,0 12,4 T20,4"
            stroke="#00AB39"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: [
                "M4,4 Q8,0 12,4 T20,4",
                "M4,4 Q8,8 12,4 T20,4",
                "M4,4 Q8,0 12,4 T20,4",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        <svg className="absolute -bottom-2 -right-2 w-6 h-6 pointer-events-none opacity-60">
          <motion.circle
            cx="3"
            cy="3"
            r="2.5"
            fill="#D4A574"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>
    </motion.div>
  );
}
