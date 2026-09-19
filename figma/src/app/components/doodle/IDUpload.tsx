import { motion, AnimatePresence } from "motion/react";
import { Upload, Camera, CheckCircle } from "lucide-react";
import { useState } from "react";
import idGraphic1 from "figma:asset/32d53c49866a895962edf70a09b2f882e5f1bf70.png";
import idGraphic2 from "figma:asset/3a9cc1df9539cddff4633c2231f0284ce0837611.png";

interface IDUploadProps {
  onUpload: (file: File) => void;
  label?: string;
}

export function IDUpload({
  onUpload,
  label = "Upload ID / DNI / Passport",
}: IDUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGraphic, setShowGraphic] = useState<1 | 2>(1);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = () => {
      // Simulate OCR processing
      setTimeout(() => {
        setUploadedFile(reader.result as string);
        setIsProcessing(false);
        onUpload(file);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg text-[#5D4E37] font-medium mb-2">
        {label}
      </label>

      {/* ID Graphics Reference */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <motion.div
          whileHover={{ scale: 1.02, rotate: -1 }}
          onClick={() => setShowGraphic(1)}
          className={`cursor-pointer p-2 doodle-border ${showGraphic === 1 ? "ring-2 ring-[#00AB39]" : ""}`}
        >
          <img src={idGraphic1} alt="ID example 1" className="w-full h-auto" />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, rotate: 1 }}
          onClick={() => setShowGraphic(2)}
          className={`cursor-pointer p-2 doodle-border ${showGraphic === 2 ? "ring-2 ring-[#00AB39]" : ""}`}
        >
          <img src={idGraphic2} alt="ID example 2" className="w-full h-auto" />
        </motion.div>
      </div>

      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative overflow-hidden transition-all duration-300 ${
              isDragging ? "scale-105" : ""
            }`}
          >
            {/* Hand-drawn border SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.1))" }}
            >
              <rect
                x="4"
                y="4"
                width="calc(100% - 8px)"
                height="calc(100% - 8px)"
                fill={isDragging ? "#E8F5E9" : "#FFF9F0"}
                stroke={isDragging ? "#00AB39" : "#5D4E37"}
                strokeWidth="3"
                rx="16"
                strokeDasharray={isDragging ? "0" : "8, 8"}
                style={{ strokeLinecap: "round" }}
              />
              <rect
                x="6"
                y="6"
                width="calc(100% - 12px)"
                height="calc(100% - 12px)"
                fill="none"
                stroke={isDragging ? "#00AB39" : "#5D4E37"}
                strokeWidth="2"
                rx="14"
                opacity="0.3"
                strokeDasharray="4, 4"
              />
            </svg>

            <div className="relative z-10 p-12 text-center">
              {isProcessing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 mx-auto"
                  >
                    <svg viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#00AB39"
                        strokeWidth="4"
                        strokeDasharray="40, 140"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                  <p className="text-[#00AB39] hand-drawn text-xl">
                    Processing your document...
                  </p>
                  <p className="text-sm text-gray-600">
                    Simulating OCR extraction
                  </p>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-20 h-20 mx-auto mb-4"
                  >
                    <Upload
                      className="w-full h-full text-[#00AB39]"
                      strokeWidth={2}
                    />
                  </motion.div>
                  <h3 className="text-2xl sketch-title text-[#5D4E37] mb-2">
                    {isDragging ? "Drop it here!" : "Upload Your Document"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag & drop or click to select
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Accepted: ID, DNI, Passport (JPG, PNG, PDF)
                  </p>

                  <input
                    type="file"
                    id="id-upload"
                    accept="image/*,.pdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <label htmlFor="id-upload">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block cursor-pointer"
                    >
                      <div className="relative">
                        <svg width="200" height="60">
                          <rect
                            x="4"
                            y="4"
                            width="192"
                            height="52"
                            fill="#00AB39"
                            stroke="#005a1e"
                            strokeWidth="3"
                            rx="10"
                          />
                          <rect
                            x="5"
                            y="5"
                            width="190"
                            height="50"
                            fill="none"
                            stroke="#005a1e"
                            strokeWidth="2"
                            rx="9"
                            opacity="0.3"
                            strokeDasharray="4, 4"
                          />
                          <text
                            x="100"
                            y="36"
                            textAnchor="middle"
                            fill="white"
                            fontSize="16"
                            fontFamily="Patrick Hand, cursive"
                            fontWeight="bold"
                          >
                            Choose File
                          </text>
                        </svg>
                      </div>
                    </motion.div>
                  </label>

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Camera className="w-4 h-4" />
                    <span>or use your camera</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.1))" }}
            >
              <rect
                x="4"
                y="4"
                width="calc(100% - 8px)"
                height="calc(100% - 8px)"
                fill="#E8F5E9"
                stroke="#00AB39"
                strokeWidth="3"
                rx="16"
              />
            </svg>

            <div className="relative z-10 p-8">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-12 h-12 text-[#00AB39]" />
                </motion.div>
                <div className="flex-1">
                  <h4 className="text-xl sketch-title text-[#00AB39] mb-1">
                    Document Uploaded!
                  </h4>
                  <p className="text-sm text-gray-600">
                    OCR processing complete
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg overflow-hidden border-2 border-[#00AB39]/30">
                <img
                  src={uploadedFile}
                  alt="Uploaded document"
                  className="w-full h-auto"
                />
              </div>

              <button
                onClick={() => {
                  setUploadedFile(null);
                  setIsProcessing(false);
                }}
                className="mt-4 text-sm text-[#00AB39] hover:underline hand-drawn"
              >
                Upload a different document
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OCR Simulation Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-gray-500 text-center italic"
      >
        * This demo simulates OCR extraction. In production, connect to an OCR
        API service.
      </motion.div>
    </div>
  );
}
