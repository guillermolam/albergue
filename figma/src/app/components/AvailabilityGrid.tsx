import { useState } from "react";
import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { DoodleBed } from "./doodle/DoodleBed";
import { DoodleCard } from "./doodle/DoodleCard";

type BedStatus = "available" | "selected" | "reserved" | "occupied";

interface Bed {
  id: string;
  number: number;
  status: BedStatus;
}

interface AvailabilityGridProps {
  onBedsSelected: (beds: string[], date: Date | undefined) => void;
}

export function AvailabilityGrid({ onBedsSelected }: AvailabilityGridProps) {
  const [dormitory1Beds, setDormitory1Beds] = useState<Bed[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: `dorm1-bed-${i + 1}`,
      number: i + 1,
      status: i === 4 ? "reserved" : i === 7 ? "occupied" : "available",
    })),
  );

  const [dormitory2Beds, setDormitory2Beds] = useState<Bed[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: `dorm2-bed-${i + 1}`,
      number: i + 1,
      status: i === 2 ? "reserved" : i === 9 ? "occupied" : "available",
    })),
  );

  const [checkInDate, setCheckInDate] = useState<string>("");

  const handleBedClick = (dormitory: "dorm1" | "dorm2", bedId: string) => {
    if (dormitory === "dorm1") {
      setDormitory1Beds((prev) =>
        prev.map((bed) =>
          bed.id === bedId &&
          bed.status !== "reserved" &&
          bed.status !== "occupied"
            ? {
                ...bed,
                status: bed.status === "selected" ? "available" : "selected",
              }
            : bed,
        ),
      );
    } else {
      setDormitory2Beds((prev) =>
        prev.map((bed) =>
          bed.id === bedId &&
          bed.status !== "reserved" &&
          bed.status !== "occupied"
            ? {
                ...bed,
                status: bed.status === "selected" ? "available" : "selected",
              }
            : bed,
        ),
      );
    }
  };

  const selectedBeds = [
    ...dormitory1Beds.filter((b) => b.status === "selected").map((b) => b.id),
    ...dormitory2Beds.filter((b) => b.status === "selected").map((b) => b.id),
  ];

  // Update parent component when selection changes
  useState(() => {
    const date = checkInDate ? new Date(checkInDate) : undefined;
    onBedsSelected(selectedBeds, date);
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckInDate(e.target.value);
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onBedsSelected(selectedBeds, date);
  };

  return (
    <div className="space-y-8">
      {/* Date Picker */}
      <DoodleCard color="#0071BC">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[#0071BC]" />
            <h3 className="text-2xl sketch-title">Select Check-in Date</h3>
          </div>
          <input
            type="date"
            value={checkInDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 doodle-border bg-white focus:outline-none focus:ring-2 focus:ring-[#0071BC] text-lg"
            style={{ fontFamily: "Patrick Hand, cursive" }}
          />
        </div>
      </DoodleCard>

      {/* Legend */}
      <DoodleCard color="#5D4E37">
        <div className="flex flex-wrap gap-6 justify-center">
          {[
            { status: "available", label: "Available", color: "#00AB39" },
            { status: "selected", label: "Your Selection", color: "#0071BC" },
            { status: "reserved", label: "Reserved", color: "#EAC102" },
            { status: "occupied", label: "Occupied", color: "#ED1C24" },
          ].map((item) => (
            <motion.div
              key={item.status}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <svg width="32" height="32">
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="3"
                  style={{ strokeDasharray: "2, 2" }}
                />
                <circle cx="16" cy="16" r="8" fill={item.color} opacity="0.3" />
              </svg>
              <span
                className="text-gray-700"
                style={{ fontFamily: "Patrick Hand, cursive" }}
              >
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </DoodleCard>

      {/* Dormitory 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DoodleCard color="#00AB39">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl sketch-title text-[#00AB39]">
                🏠 Dormitory 1
              </h3>
              <div className="text-right hand-drawn text-lg text-gray-600">
                <div>12 beds total</div>
                <div className="text-[#00AB39] font-semibold">
                  {
                    dormitory1Beds.filter(
                      (b) =>
                        b.status === "available" || b.status === "selected",
                    ).length
                  }{" "}
                  available
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {dormitory1Beds.map((bed, index) => (
                <motion.div
                  key={bed.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DoodleBed
                    bedNumber={bed.number}
                    status={bed.status}
                    onClick={() => handleBedClick("dorm1", bed.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </DoodleCard>
      </motion.div>

      {/* Dormitory 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DoodleCard color="#D4A574">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl sketch-title text-[#D4A574]">
                🏠 Dormitory 2
              </h3>
              <div className="text-right hand-drawn text-lg text-gray-600">
                <div>12 beds total</div>
                <div className="text-[#D4A574] font-semibold">
                  {
                    dormitory2Beds.filter(
                      (b) =>
                        b.status === "available" || b.status === "selected",
                    ).length
                  }{" "}
                  available
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {dormitory2Beds.map((bed, index) => (
                <motion.div
                  key={bed.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DoodleBed
                    bedNumber={bed.number}
                    status={bed.status}
                    onClick={() => handleBedClick("dorm2", bed.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </DoodleCard>
      </motion.div>

      {/* Selection Summary */}
      {selectedBeds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <DoodleCard color="#0071BC">
            <div className="text-center">
              <p className="text-2xl sketch-title text-[#0071BC] mb-2">
                ✨ {selectedBeds.length} bed{selectedBeds.length > 1 ? "s" : ""}{" "}
                selected
              </p>
              <p className="text-gray-600 hand-drawn">
                {checkInDate
                  ? `Check-in: ${new Date(checkInDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`
                  : "Please select a check-in date"}
              </p>
            </div>
          </DoodleCard>
        </motion.div>
      )}
    </div>
  );
}
