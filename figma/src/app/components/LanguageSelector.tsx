import { motion, AnimatePresence } from "motion/react";
import { Globe } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";
import { useState } from "react";

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en" as const, label: "English", flag: "🇬🇧" },
    { code: "es" as const, label: "Español", flag: "🇪🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative">
      {/* Current language button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-4 py-2.5 cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Doodle background */}
        <svg className="absolute inset-0 w-full h-full">
          <rect
            x="2"
            y="2"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            fill="white"
            stroke="#00AB39"
            strokeWidth="2.5"
            rx="20"
            className="transition-all group-hover:stroke-[#006b24]"
          />
          <rect
            x="4"
            y="4"
            width="calc(100% - 8px)"
            height="calc(100% - 8px)"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="1"
            rx="18"
            opacity="0.3"
          />
        </svg>

        {/* Content */}
        <Globe
          className="relative w-5 h-5 text-[#00AB39] group-hover:text-[#006b24] transition-colors"
          strokeWidth={2.5}
        />
        <span
          className="relative text-lg text-[#1A1A1A] group-hover:text-[#006b24] transition-colors"
          style={{ fontFamily: "Patrick Hand, cursive" }}
        >
          {currentLanguage?.label}
        </span>

        {/* Arrow indicator */}
        <motion.svg
          className="relative w-4 h-4 text-[#00AB39]"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>

        {/* Floating particles */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-[#00AB39] rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              className="absolute top-full right-0 mt-2 z-50 min-w-[160px]"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Shadow */}
              <div className="absolute inset-0 bg-black/20 blur-xl transform translate-y-2" />

              {/* Menu background */}
              <svg className="absolute inset-0 w-full h-full">
                <rect
                  x="3"
                  y="3"
                  width="calc(100% - 6px)"
                  height="calc(100% - 6px)"
                  fill="white"
                  stroke="#1A1A1A"
                  strokeWidth="3"
                  rx="16"
                />
                <rect
                  x="6"
                  y="6"
                  width="calc(100% - 12px)"
                  height="calc(100% - 12px)"
                  fill="none"
                  stroke="#00AB39"
                  strokeWidth="2"
                  rx="14"
                  opacity="0.6"
                />
              </svg>

              {/* Menu items */}
              <div className="relative p-2">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className="relative w-full flex items-center gap-3 px-4 py-3 cursor-pointer group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 3 }}
                  >
                    {/* Hover background */}
                    <motion.div
                      className="absolute inset-1 rounded-xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0, 171, 57, 0.1) 0%, rgba(0, 171, 57, 0.05) 100%)",
                      }}
                    />

                    {/* Active indicator */}
                    {language === lang.code && (
                      <motion.div
                        className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00AB39] rounded-full"
                        layoutId="activeLanguage"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Flag emoji */}
                    <span className="relative text-2xl">{lang.flag}</span>

                    {/* Language label */}
                    <span
                      className={`relative text-lg transition-colors ${
                        language === lang.code
                          ? "text-[#00AB39]"
                          : "text-[#1A1A1A] group-hover:text-[#00AB39]"
                      }`}
                      style={{ fontFamily: "Patrick Hand, cursive" }}
                    >
                      {lang.label}
                    </span>

                    {/* Check mark for active language */}
                    {language === lang.code && (
                      <motion.svg
                        className="relative ml-auto w-5 h-5 text-[#00AB39]"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Decorative corner stars */}
              {[
                { top: "8px", right: "8px" },
                { bottom: "8px", left: "8px" },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 pointer-events-none"
                  style={pos}
                  animate={{
                    rotate: [0, 180, 360],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path
                      d="M8,1 L9,7 L15,8 L9,9 L8,15 L7,9 L1,8 L7,7 Z"
                      fill="#00AB39"
                      opacity="0.6"
                    />
                  </svg>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
