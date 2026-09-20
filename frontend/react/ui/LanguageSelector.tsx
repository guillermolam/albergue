import { motion, AnimatePresence } from 'motion/react';
import { Globe, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useI18n } from '../hooks/useI18n';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { LANGUAGES, type Language } from '../../src/stores/i18nStore';

const ALL_LANGUAGES = Object.values(LANGUAGES);

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const animateDecorations = !usePrefersReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);

  // The backdrop below is a click-to-dismiss overlay, not a focusable
  // control (aria-hidden, no keyboard handler on it) -- keyboard users
  // need Escape to close the dropdown instead.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Autofocus the search input on open; clear the query on close so the
  // next open starts from the full list again.
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return ALL_LANGUAGES;
    return ALL_LANGUAGES.filter((lang) => lang.name.toLowerCase().includes(normalized));
  }, [query]);

  const currentLanguage: Language = LANGUAGES[locale];

  function selectLanguage(code: Language['code']) {
    setLocale(code);
    setIsOpen(false);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && filteredLanguages.length > 0) {
      event.preventDefault();
      selectLanguage(filteredLanguages[0].code);
    }
  }

  return (
    <div className="relative">
      {/* Current language button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
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
          className="relative text-lg text-[#1A1A1D] group-hover:text-[#006b24] transition-colors"
          style={{ fontFamily: 'Patrick Hand, cursive' }}
        >
          {currentLanguage.name}
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

        {/* Floating particle */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-[#00AB39] rounded-full"
          animate={
            animateDecorations
              ? { scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }
              : { scale: 1, opacity: 0.8 }
          }
          transition={{ duration: 2, repeat: animateDecorations ? Infinity : 0 }}
        />
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop -- decorative click-to-dismiss only; not
                focusable/interactive, so aria-hidden. Escape (handled
                above) is the keyboard equivalent. */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Menu */}
            <motion.div
              className="absolute top-full right-0 mt-2 z-50 w-64"
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

              <div className="relative p-2">
                {/* Search / autocomplete input */}
                <div className="relative mb-1.5 flex items-center gap-2 rounded-lg border-2 border-[#5D4E37]/20 bg-white px-3 py-1.5">
                  <Search className="h-4 w-4 shrink-0 text-[#5D4E37]/50" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls="language-selector-list"
                    aria-autocomplete="list"
                    autoComplete="off"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search language..."
                    className="w-full bg-transparent text-sm text-[#1A1A1D] outline-none placeholder:text-[#5D4E37]/40"
                    style={{ fontFamily: 'Patrick Hand, cursive' }}
                  />
                </div>

                {/* Menu items */}
                <div
                  id="language-selector-list"
                  role="listbox"
                  className="max-h-56 overflow-y-auto"
                >
                  {filteredLanguages.length === 0 && (
                    <p className="px-3 py-4 text-center text-sm text-[#5D4E37]/50">
                      No matching language
                    </p>
                  )}
                  {filteredLanguages.map((lang, index) => (
                    <motion.button
                      key={lang.code}
                      type="button"
                      role="option"
                      aria-selected={locale === lang.code}
                      onClick={() => selectLanguage(lang.code)}
                      className="relative w-full flex items-center gap-3 px-3 py-2.5 cursor-pointer group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(index, 8) * 0.03 }}
                      whileHover={{ x: 3 }}
                    >
                      {/* Hover background */}
                      <motion.div
                        className="absolute inset-1 rounded-xl"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(0, 171, 57, 0.1) 0%, rgba(0, 171, 57, 0.05) 100%)',
                        }}
                      />

                      {/* Active indicator */}
                      {locale === lang.code && (
                        <motion.div
                          className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00AB39] rounded-full"
                          layoutId="activeLanguage"
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Flag emoji */}
                      <span className="relative text-xl">{lang.flag}</span>

                      {/* Language name */}
                      <span
                        className={`relative text-base transition-colors ${
                          locale === lang.code
                            ? 'text-[#00AB39]'
                            : 'text-[#1A1A1D] group-hover:text-[#00AB39]'
                        }`}
                        style={{ fontFamily: 'Patrick Hand, cursive' }}
                      >
                        {lang.name}
                      </span>

                      {/* Check mark for active language */}
                      {locale === lang.code && (
                        <motion.svg
                          className="relative ml-auto w-4 h-4 text-[#00AB39]"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: 'spring',
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
              </div>

              {/* Decorative corner stars */}
              {[
                { top: '8px', right: '8px' },
                { bottom: '8px', left: '8px' },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 pointer-events-none"
                  style={pos}
                  animate={
                    animateDecorations
                      ? { rotate: [0, 180, 360], scale: [1, 1.15, 1] }
                      : { rotate: 0, scale: 1 }
                  }
                  transition={{
                    duration: 3,
                    repeat: animateDecorations ? Infinity : 0,
                    delay: i * 0.5,
                  }}
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
