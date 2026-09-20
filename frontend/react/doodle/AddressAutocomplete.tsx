import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPinIcon as MapPin, LoaderIcon as Loader } from './DoodleIcons';

interface NominatimAddress {
  road?: string;
  house_number?: string;
  city?: string;
  town?: string;
  village?: string;
  postcode?: string;
  country?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  address?: NominatimAddress;
}

interface AddressSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
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

const DEBOUNCE_MS = 500;
const MIN_QUERY_LENGTH = 3;
// Nominatim's usage policy (https://operations.osmfoundation.org/policies/
// nominatim/) asks callers to identify themselves. Browsers can't set a
// custom User-Agent from fetch(), so the `email` param is their documented
// alternative for client-side callers.
const NOMINATIM_CONTACT_EMAIL = 'info@alberguecarrascalejo.com';

function toSuggestion(result: NominatimResult): AddressSuggestion {
  const addr = result.address ?? {};
  const streetParts = [addr.road, addr.house_number].filter(Boolean);
  const street = streetParts.join(' ') || result.display_name.split(',')[0];
  const city = addr.city ?? addr.town ?? addr.village ?? '';

  return {
    placeId: String(result.place_id),
    description: result.display_name,
    mainText: street,
    secondaryText: [city, addr.country].filter(Boolean).join(', '),
    address: street,
    city,
    postalCode: addr.postcode ?? '',
    country: addr.country ?? '',
  };
}

async function searchNominatim(query: string, signal: AbortSignal): Promise<AddressSuggestion[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '5');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('email', NOMINATIM_CONTACT_EMAIL);

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Nominatim request failed: ${res.status}`);
  const results = (await res.json()) as NominatimResult[];
  return results.map(toSuggestion);
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  label = 'Street Address',
  placeholder = 'Start typing your address...',
  required = false,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortRef = useRef<AbortController | undefined>(undefined);

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

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    if (newValue.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const results = await searchNominatim(newValue.trim(), controller.signal);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.mainText);
    onChange(suggestion.mainText);
    setShowSuggestions(false);

    onPlaceSelected?.({
      address: suggestion.address,
      city: suggestion.city,
      postalCode: suggestion.postalCode,
      country: suggestion.country,
    });
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
            minLength={1}
            maxLength={120}
            autoComplete="address-line1"
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
                transition={{
                  rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
                }}
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
                      <p
                        className="text-sm font-medium text-[#5D4E37] truncate"
                        style={{ fontFamily: 'Patrick Hand, cursive' }}
                      >
                        {suggestion.mainText}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{suggestion.secondaryText}</p>
                    </div>
                  </motion.button>
                ))}

                <div className="mt-2 px-3 py-2 text-xs text-gray-400 text-center border-t border-gray-200">
                  <p className="hand-drawn">🗺️ © OpenStreetMap contributors</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <AnimatePresence>
        {focused && inputValue.length > 0 && inputValue.length < MIN_QUERY_LENGTH && (
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
