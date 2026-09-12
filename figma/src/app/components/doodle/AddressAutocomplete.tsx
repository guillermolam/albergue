import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Loader } from 'lucide-react';

interface AddressSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

// Mock address suggestions (in production, connect to Google Maps API)
const mockSuggestions: Record<string, AddressSuggestion[]> = {
  'calle': [
    { placeId: '1', description: 'Calle Mayor, 123, Madrid, Spain', mainText: 'Calle Mayor, 123', secondaryText: 'Madrid, Spain' },
    { placeId: '2', description: 'Calle Gran Vía, 45, Madrid, Spain', mainText: 'Calle Gran Vía, 45', secondaryText: 'Madrid, Spain' },
    { placeId: '3', description: 'Calle de Alcalá, 67, Madrid, Spain', mainText: 'Calle de Alcalá, 67', secondaryText: 'Madrid, Spain' },
  ],
  'main': [
    { placeId: '4', description: '123 Main Street, London, UK', mainText: '123 Main Street', secondaryText: 'London, UK' },
    { placeId: '5', description: '456 Main Avenue, New York, USA', mainText: '456 Main Avenue', secondaryText: 'New York, USA' },
  ],
  'rue': [
    { placeId: '6', description: '78 Rue de Rivoli, Paris, France', mainText: '78 Rue de Rivoli', secondaryText: 'Paris, France' },
    { placeId: '7', description: '90 Rue Saint-Honoré, Paris, France', mainText: '90 Rue Saint-Honoré', secondaryText: 'Paris, France' },
  ]
};

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  label = "Street Address",
  placeholder = "Start typing your address...",
  required = false
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    if (newValue.length >= 3) {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const searchTerm = newValue.toLowerCase();
        let results: AddressSuggestion[] = [];
        
        // Mock search through suggestions
        Object.keys(mockSuggestions).forEach(key => {
          if (searchTerm.includes(key)) {
            results = [...results, ...mockSuggestions[key]];
          }
        });

        // If no specific matches, show all
        if (results.length === 0 && searchTerm.length > 0) {
          results = Object.values(mockSuggestions).flat().slice(0, 5);
        }

        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.mainText);
    onChange(suggestion.mainText);
    setShowSuggestions(false);

    // Extract city and postal code from mock data
    if (onPlaceSelected) {
      // Parse mock data (in production, use actual Google Places API response)
      const parts = suggestion.description.split(', ');
      onPlaceSelected({
        address: suggestion.mainText,
        city: parts[parts.length - 2] || '',
        postalCode: '28001', // Mock postal code
        country: parts[parts.length - 1] || ''
      });
    }
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-[#5D4E37] mb-2 sketch-title">
          {label} {required && <span className="text-[#ED1C24]">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Hand-drawn border */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.08))' }}
        >
          <rect
            x="3"
            y="3"
            width="calc(100% - 6px)"
            height="calc(100% - 6px)"
            fill="#FFF9F0"
            stroke={focused ? '#0071BC' : '#D4A574'}
            strokeWidth={focused ? '3' : '2.5'}
            rx="12"
            style={{ strokeLinecap: 'round' }}
          />
          {focused && (
            <rect
              x="5"
              y="5"
              width="calc(100% - 10px)"
              height="calc(100% - 10px)"
              fill="none"
              stroke="#0071BC"
              strokeWidth="2"
              rx="10"
              opacity="0.3"
              strokeDasharray="4, 4"
            />
          )}
        </svg>

        <div className="relative z-10 flex items-center">
          <MapPin className="absolute left-3 w-5 h-5 text-[#0071BC]" />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              setFocused(true);
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="w-full pl-11 pr-10 py-3 bg-transparent focus:outline-none text-[#5D4E37]"
            style={{ fontFamily: 'Patrick Hand, cursive', fontSize: '16px' }}
          />

          {/* Loading Indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                className="absolute right-3"
              >
                <Loader className="w-5 h-5 text-[#0071BC]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              {/* Dropdown border */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ filter: 'drop-shadow(4px 6px 8px rgba(0,0,0,0.15))' }}
              >
                <rect
                  x="4"
                  y="4"
                  width="calc(100% - 8px)"
                  height="calc(100% - 8px)"
                  fill="white"
                  stroke="#0071BC"
                  strokeWidth="3"
                  rx="16"
                />
              </svg>

              <div className="relative z-10 p-2 max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.placeId}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    whileHover={{ x: 4, backgroundColor: '#E3F2FD' }}
                    className="w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-[#0071BC] mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#5D4E37] truncate" style={{ fontFamily: 'Patrick Hand, cursive' }}>
                        {suggestion.mainText}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {suggestion.secondaryText}
                      </p>
                    </div>
                  </motion.button>
                ))}

                {/* Google Maps Attribution */}
                <div className="mt-2 px-3 py-2 text-xs text-gray-400 text-center border-t border-gray-200">
                  <p className="hand-drawn">🗺️ Powered by Google Maps API (Demo)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <AnimatePresence>
        {focused && inputValue.length > 0 && inputValue.length < 3 && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 text-xs text-gray-500 hand-drawn"
          >
            Keep typing to see suggestions...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
