import { useState } from "react";
import { motion } from "motion/react";
import { AvailabilityGrid } from "./AvailabilityGrid";
import { BookingForm } from "./BookingForm";
import { WiredButton } from "./doodle/WiredButton";

export function BookingPage() {
  const [selectedBeds, setSelectedBeds] = useState<string[]>([]);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [showForm, setShowForm] = useState(false);

  const handleBedsSelected = (beds: string[], date: Date | undefined) => {
    setSelectedBeds(beds);
    setCheckInDate(date);
  };

  const handleProceedToForm = () => {
    if (selectedBeds.length === 0) {
      alert("Please select at least one bed");
      return;
    }
    if (!checkInDate) {
      alert("Please select a check-in date");
      return;
    }
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] paper-texture">
      {/* Decorative doodle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <svg className="w-full h-full">
          <pattern
            id="doodlePattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10,10 Q20,5 30,10 T50,10"
              stroke="#5D4E37"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="70"
              cy="30"
              r="5"
              stroke="#00AB39"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M20,60 L30,70 L20,80"
              stroke="#D4A574"
              strokeWidth="2"
              fill="none"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#doodlePattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <motion.span
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="hand-drawn text-6xl text-[#00AB39] block mb-4"
            >
              ~ Reserve Your Spot ~
            </motion.span>
            <h1 className="mb-4 text-5xl md:text-6xl sketch-title">
              Book Your Stay
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Select your preferred{" "}
              <span className="highlight-doodle">beds and dates</span>, then
              complete the booking form
            </p>

            {/* Decorative squiggle */}
            <svg className="mx-auto mt-4 w-32 h-2 opacity-40">
              <path
                d="M0,1 Q8,-1 16,1 T32,1 T48,1 T64,1 T80,1 T96,1 T112,1 T128,1"
                stroke="#00AB39"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {!showForm ? (
            <>
              <AvailabilityGrid onBedsSelected={handleBedsSelected} />

              {selectedBeds.length > 0 && checkInDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 flex justify-center"
                >
                  <WiredButton
                    size="lg"
                    variant="primary"
                    onClick={handleProceedToForm}
                  >
                    Proceed to Booking Form! →
                  </WiredButton>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <WiredButton
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  ← Back to Bed Selection
                </WiredButton>
              </motion.div>
              <div className="mt-6">
                <BookingForm
                  selectedBeds={selectedBeds}
                  checkInDate={checkInDate}
                />
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
