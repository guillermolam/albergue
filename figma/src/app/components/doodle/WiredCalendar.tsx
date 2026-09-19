import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WiredCalendarProps {
  onSelectRange: (startDate: Date, endDate: Date) => void;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  minDate?: Date;
  label?: string;
  onContinue?: () => void;
}

export function WiredCalendar({
  onSelectRange,
  selectedStartDate,
  selectedEndDate,
  minDate,
  label,
  onContinue,
}: WiredCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    selectedStartDate || new Date(),
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    selectedStartDate,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(selectedEndDate);
  const [hoverDate, setHoverDate] = useState<Date | undefined>();
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setIsTransitioning(true);
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNextMonth = () => {
    setIsTransitioning(true);
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    // If no start date or we're resetting
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(undefined);
      setIsSelectingEnd(true);
      setShowContinueButton(false);
    }
    // If we have a start date and clicking on the same date
    else if (isSameDay(startDate, date)) {
      setStartDate(undefined);
      setEndDate(undefined);
      setIsSelectingEnd(false);
      setShowContinueButton(false);
    }
    // If we have a start date and clicking before it
    else if (date < startDate) {
      setStartDate(date);
      setEndDate(undefined);
      setIsSelectingEnd(true);
      setShowContinueButton(false);
    }
    // If we have a start date and clicking after it (complete range)
    else {
      setEndDate(date);
      setIsSelectingEnd(false);
      setShowContinueButton(true);
      onSelectRange(startDate, date);
    }
  };

  const handleDateHover = (date: Date | null) => {
    if (startDate && !endDate && date && !isDateDisabled(date)) {
      setHoverDate(date);
    } else {
      setHoverDate(undefined);
    }
  };

  const isDateDisabled = (date: Date) => {
    if (!minDate) return false;
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const compareMin = new Date(minDate);
    compareMin.setHours(0, 0, 0, 0);
    return compareDate < compareMin;
  };

  const isSameDay = (date1: Date | undefined, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return isSameDay(today, date);
  };

  const isInRange = (date: Date | null) => {
    if (!date || !startDate) return false;

    const effectiveEndDate = endDate || hoverDate;
    if (!effectiveEndDate) return false;

    const dateTime = date.getTime();
    const start = startDate.getTime();
    const end = effectiveEndDate.getTime();

    return dateTime > start && dateTime < end;
  };

  const isRangeStart = (date: Date | null) => {
    if (!date || !startDate) return false;
    return isSameDay(startDate, date);
  };

  const isRangeEnd = (date: Date | null) => {
    if (!date) return false;
    const effectiveEndDate =
      endDate ||
      (hoverDate && startDate && hoverDate > startDate ? hoverDate : undefined);
    if (!effectiveEndDate) return false;
    return isSameDay(effectiveEndDate, date);
  };

  const clearSelection = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setHoverDate(undefined);
    setIsSelectingEnd(false);
    setShowContinueButton(false);
  };

  const nights =
    startDate && (endDate || hoverDate)
      ? Math.ceil(
          ((endDate || hoverDate)!.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Info Bar at Top - Check-in, Check-out, Nights */}
      <AnimatePresence>
        {startDate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 doodle-radius border-2 border-[#00AB39] doodle-shadow">
              {/* Left: Date Info */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Check-in */}
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#E8F5E9] doodle-radius flex-shrink-0">
                  <div>
                    <p
                      className="text-xs text-gray-600"
                      style={{ fontFamily: "Patrick Hand, cursive" }}
                    >
                      Check-in
                    </p>
                    <p className="text-lg sm:text-xl text-[#00AB39] sketch-title">
                      {startDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-xl sm:text-2xl text-[#00AB39] flex-shrink-0">
                  →
                </div>

                {/* Check-out */}
                {(endDate || hoverDate) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 doodle-radius flex-shrink-0"
                    style={{
                      backgroundColor: endDate ? "#E8F5E9" : "#F5F5F5",
                    }}
                  >
                    <div>
                      <p
                        className="text-xs text-gray-600"
                        style={{ fontFamily: "Patrick Hand, cursive" }}
                      >
                        Check-out
                      </p>
                      <p
                        className="text-lg sm:text-xl sketch-title"
                        style={{
                          color: endDate ? "#00AB39" : "#999",
                        }}
                      >
                        {(endDate || hoverDate)!.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Nights indicator */}
                {nights > 0 && (
                  <>
                    <div className="hidden sm:block w-px h-8 bg-gray-300 mx-2 flex-shrink-0" />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-3 sm:px-4 py-2 bg-[#00AB39] doodle-radius text-white flex-shrink-0"
                    >
                      <p
                        className="text-xs sm:text-sm"
                        style={{ fontFamily: "Patrick Hand, cursive" }}
                      >
                        Total Nights
                      </p>
                      <p className="text-xl sm:text-2xl sketch-title">
                        🌙 {nights}
                      </p>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Right: Clear + Info + Continue */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                {/* Info text */}
                <p
                  className="text-xs sm:text-sm text-gray-500 hidden md:block"
                  style={{ fontFamily: "Patrick Hand, cursive" }}
                >
                  ✨ Check-in: 2:00 PM | Check-out: 10:00 AM
                </p>

                {/* Clear button */}
                <button
                  onClick={clearSelection}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-[#ED1C24] underline transition-colors flex-shrink-0"
                  style={{ fontFamily: "Patrick Hand, cursive" }}
                >
                  Clear
                </button>

                {/* Continue Button - Shows when dates selected */}
                {showContinueButton && endDate && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-shrink-0"
                  >
                    <button
                      className="px-4 sm:px-6 py-2 bg-[#00AB39] text-white doodle-radius border-2 border-[#006b24] hover:bg-[#006b24] transition-colors doodle-shadow text-sm sm:text-base"
                      style={{ fontFamily: "Patrick Hand, cursive" }}
                      onClick={onContinue}
                    >
                      Continue to ID Upload →
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Container - Ensures arrows don't get clipped */}
      <div className="relative">
        {/* Extra padding for arrows on larger screens */}
        <div className="hidden lg:block absolute inset-0 -left-24 -right-24 pointer-events-none" />

        <div className="relative overflow-visible">
          {/* Background Video Texturizer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-10"
              style={{
                mixBlendMode: "multiply",
                filter: "blur(1px) contrast(1.2) saturate(0.3)",
              }}
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-paper-texture-close-up-4356-large.mp4"
                type="video/mp4"
              />
            </video>
          </div>

          {/* Hand-drawn border */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ filter: "drop-shadow(3px 4px 6px rgba(0,0,0,0.1))" }}
          >
            <rect
              x="4"
              y="4"
              width="calc(100% - 8px)"
              height="calc(100% - 8px)"
              fill="white"
              fillOpacity="0.95"
              stroke="#00AB39"
              strokeWidth="3.5"
              rx="20"
              style={{ strokeLinecap: "round" }}
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

          <div className="relative z-20 p-3 sm:p-4 lg:p-6">
            {/* Month Header with Floating Doodle Arrows */}
            <div className="relative flex items-center justify-center mb-8">
              {/* Left Arrow - Doodle Style with Bounce - Responsive positioning */}
              <motion.div
                className="absolute left-0 sm:-left-16 lg:-left-20 z-30"
                style={{ top: "50%", transform: "translateY(-50%)" }}
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.2,
                    rotate: -10,
                    y: [-5, -15, -5],
                    transition: { y: { duration: 0.5, repeat: Infinity } },
                  }}
                  whileTap={{ scale: 0.85 }}
                  onClick={handlePrevMonth}
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-white border-3 border-[#00AB39] text-[#00AB39] hover:bg-[#E8F5E9] transition-colors doodle-shadow-md relative"
                  style={{
                    borderRadius: "50% 45% 48% 52% / 52% 48% 52% 48%",
                  }}
                  aria-label="Previous month"
                >
                  {/* Hand-drawn circle border */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#00AB39"
                      strokeWidth="3"
                      strokeDasharray="2,3"
                      opacity="0.3"
                    />
                  </svg>
                  <ChevronLeft
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 relative z-10"
                    strokeWidth={3}
                  />
                </motion.button>
              </motion.div>

              {/* Month Title with Transition - Responsive sizing */}
              <AnimatePresence mode="wait">
                <motion.h3
                  key={currentMonth.toISOString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl sm:text-3xl lg:text-4xl sketch-title text-[#00AB39] px-12 sm:px-0"
                >
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </motion.h3>
              </AnimatePresence>

              {/* Right Arrow - Doodle Style with Bounce - Responsive positioning */}
              <motion.div
                className="absolute right-0 sm:-right-16 lg:-right-20 z-30"
                style={{ top: "50%", transform: "translateY(-50%)" }}
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.2,
                    rotate: 10,
                    y: [-5, -15, -5],
                    transition: { y: { duration: 0.5, repeat: Infinity } },
                  }}
                  whileTap={{ scale: 0.85 }}
                  onClick={handleNextMonth}
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-white border-3 border-[#00AB39] text-[#00AB39] hover:bg-[#E8F5E9] transition-colors doodle-shadow-md relative"
                  style={{
                    borderRadius: "48% 52% 50% 50% / 50% 50% 48% 52%",
                  }}
                  aria-label="Next month"
                >
                  {/* Hand-drawn circle border */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#00AB39"
                      strokeWidth="3"
                      strokeDasharray="2,3"
                      opacity="0.3"
                    />
                  </svg>
                  <ChevronRight
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 relative z-10"
                    strokeWidth={3}
                  />
                </motion.button>
              </motion.div>
            </div>

            {/* Day Names - Responsive sizing */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMonth.toISOString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 mb-3 sm:mb-4"
              >
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm sm:text-base lg:text-lg text-[#5D4E37] sketch-title"
                  >
                    {day}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Calendar Grid with Transition - Responsive gap */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMonth.toISOString()}
                initial={{ opacity: 0, x: isTransitioning ? 20 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3"
                onMouseLeave={() => setHoverDate(undefined)}
              >
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} />;
                  }

                  const disabled = isDateDisabled(date);
                  const isStart = isRangeStart(date);
                  const isEnd = isRangeEnd(date);
                  const inRange = isInRange(date);
                  const isTodayDate = isToday(date);
                  const isHovering = hoverDate && isSameDay(hoverDate, date);

                  return (
                    <motion.button
                      key={date.toISOString()}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.01 }}
                      whileHover={!disabled ? { scale: 1.15, rotate: 3 } : {}}
                      whileTap={!disabled ? { scale: 0.9 } : {}}
                      onClick={() => !disabled && handleDateClick(date)}
                      onMouseEnter={() => handleDateHover(date)}
                      disabled={disabled}
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center transition-all ${
                        disabled
                          ? "text-gray-300 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      {/* Hand-drawn cell border */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 100 100"
                      >
                        <rect
                          x="5"
                          y="5"
                          width="90"
                          height="90"
                          rx={isStart || isEnd ? "20" : inRange ? "8" : "15"}
                          fill={
                            isStart || isEnd
                              ? "#00AB39"
                              : inRange
                                ? isHovering && !endDate
                                  ? "rgba(0, 171, 57, 0.2)"
                                  : "rgba(0, 171, 57, 0.15)"
                                : isTodayDate
                                  ? "#EAC102"
                                  : disabled
                                    ? "#f5f5f5"
                                    : "#FFF9F0"
                          }
                          stroke={
                            isStart || isEnd
                              ? "#005a1e"
                              : inRange
                                ? "rgba(0, 171, 57, 0.3)"
                                : isTodayDate
                                  ? "#D4A574"
                                  : disabled
                                    ? "#e0e0e0"
                                    : "#D4A574"
                          }
                          strokeWidth={
                            isStart || isEnd ? "4" : inRange ? "2" : "2.5"
                          }
                          style={{ strokeLinecap: "round" }}
                        />
                        {(isStart || isEnd) && (
                          <rect
                            x="7"
                            y="7"
                            width="86"
                            height="86"
                            rx="18"
                            fill="none"
                            stroke="#005a1e"
                            strokeWidth="2"
                            opacity="0.3"
                            strokeDasharray="4, 4"
                          />
                        )}
                      </svg>

                      <span
                        className={`relative z-10 text-lg ${
                          isStart || isEnd
                            ? "text-white sketch-title"
                            : isTodayDate && !inRange
                              ? "text-white sketch-title"
                              : inRange
                                ? "text-[#00AB39] sketch-title"
                                : disabled
                                  ? "text-gray-300"
                                  : "text-[#5D4E37]"
                        }`}
                        style={{ fontFamily: "Patrick Hand, cursive" }}
                      >
                        {date.getDate()}
                      </span>

                      {/* Today indicator */}
                      {isTodayDate && !isStart && !isEnd && !inRange && (
                        <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white" />
                      )}

                      {/* Range start/end indicator */}
                      {(isStart || isEnd) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-[#00AB39] flex items-center justify-center"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00AB39]" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Help text */}
            {startDate && !endDate && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center text-base text-gray-500 hand-drawn"
              >
                💡 Select your check-out date
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
