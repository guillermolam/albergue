import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Search, Check, Phone } from "lucide-react";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const countries: Country[] = [
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "🇨🇿" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  defaultCountry?: string;
  required?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  label = "Phone Number",
  placeholder = "123 456 789",
  defaultCountry = "ES",
  required = false,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === defaultCountry) || countries[0],
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Parse existing value if provided
    if (value && !phoneNumber) {
      const matchedCountry = countries.find((c) =>
        value.startsWith(c.dialCode),
      );
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        setPhoneNumber(value.replace(matchedCountry.dialCode, "").trim());
      }
    }
  }, [value]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    setSearchQuery("");
    const fullNumber = `${country.dialCode} ${phoneNumber}`.trim();
    onChange(fullNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d\s]/g, "");
    setPhoneNumber(cleaned);
    const fullNumber = `${selectedCountry.dialCode} ${cleaned}`.trim();
    onChange(fullNumber);
  };

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isValid = phoneNumber.replace(/\s/g, "").length >= 6;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#5D4E37] mb-2 sketch-title">
          {label} {required && <span className="text-[#ED1C24]">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Hand-drawn border */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ filter: "drop-shadow(2px 3px 4px rgba(0,0,0,0.08))" }}
        >
          <rect
            x="3"
            y="3"
            width="calc(100% - 6px)"
            height="calc(100% - 6px)"
            fill="#FFF9F0"
            stroke={focused ? "#00AB39" : "#D4A574"}
            strokeWidth={focused ? "3" : "2.5"}
            rx="12"
            style={{ strokeLinecap: "round" }}
          />
          {focused && (
            <rect
              x="5"
              y="5"
              width="calc(100% - 10px)"
              height="calc(100% - 10px)"
              fill="none"
              stroke="#00AB39"
              strokeWidth="2"
              rx="10"
              opacity="0.3"
              strokeDasharray="4, 4"
            />
          )}
        </svg>

        <div className="relative z-10 flex items-center">
          {/* Country Selector */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-3 py-3 border-r-2 border-[#D4A574]/30 hover:bg-[#E8F5E9] transition-colors"
            >
              <span
                className="text-2xl leading-none"
                role="img"
                aria-label={selectedCountry.name}
              >
                {selectedCountry.flag}
              </span>
              <span
                className="text-sm font-medium text-[#5D4E37]"
                style={{ fontFamily: "Patrick Hand, cursive" }}
              >
                {selectedCountry.dialCode}
              </span>
              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-[#5D4E37]" />
              </motion.div>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-80 z-50"
                >
                  {/* Dropdown border */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      filter: "drop-shadow(4px 6px 8px rgba(0,0,0,0.15))",
                    }}
                  >
                    <rect
                      x="4"
                      y="4"
                      width="calc(100% - 8px)"
                      height="calc(100% - 8px)"
                      fill="white"
                      stroke="#00AB39"
                      strokeWidth="3"
                      rx="16"
                    />
                  </svg>

                  <div className="relative z-10 p-3 max-h-80 overflow-hidden flex flex-col">
                    {/* Search */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search countries..."
                        className="w-full pl-10 pr-3 py-2 text-sm doodle-border bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#00AB39]"
                        style={{ fontFamily: "Patrick Hand, cursive" }}
                      />
                    </div>

                    {/* Country List */}
                    <div
                      className="overflow-y-auto flex-1 space-y-1 pr-2"
                      style={{ maxHeight: "250px" }}
                    >
                      {filteredCountries.map((country) => (
                        <motion.button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          whileHover={{ x: 4, backgroundColor: "#E8F5E9" }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            selectedCountry.code === country.code
                              ? "bg-[#E8F5E9]"
                              : ""
                          }`}
                        >
                          <span className="text-2xl">{country.flag}</span>
                          <div className="flex-1">
                            <p
                              className="text-sm font-medium text-[#5D4E37]"
                              style={{ fontFamily: "Patrick Hand, cursive" }}
                            >
                              {country.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {country.dialCode}
                            </p>
                          </div>
                          {selectedCountry.code === country.code && (
                            <Check className="w-4 h-4 text-[#00AB39]" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Number Input */}
          <div className="flex-1 relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              className="w-full px-4 py-3 bg-transparent focus:outline-none text-[#5D4E37]"
              style={{ fontFamily: "Patrick Hand, cursive", fontSize: "16px" }}
            />

            {/* Validation Icon */}
            <AnimatePresence>
              {phoneNumber && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {isValid ? (
                    <div className="w-6 h-6 rounded-full bg-[#00AB39] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#EAC102] flex items-center justify-center">
                      <Phone className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <AnimatePresence>
        {focused && !isValid && phoneNumber && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 text-xs text-gray-500 hand-drawn"
          >
            Enter a valid phone number
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
