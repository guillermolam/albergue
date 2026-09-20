import { motion, AnimatePresence } from 'motion/react';
import { Globe, Search } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { useI18n } from '../hooks/useI18n';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { LANGUAGES, type Language } from '../../src/stores/i18nStore';

const ALL_LANGUAGES = Object.values(LANGUAGES);

/** Offset-block colours cycled down the list, so scanning it feels like a
 * stack of cards rather than one long strip. The active language keeps the
 * brand green instead of taking its turn in the rotation. */
const LIFT_COLORS = ['#ADF296', '#96C7F2', '#F396E5', '#F2CF96'] as const;

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const animateDecorations = !usePrefersReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // The backdrop below is a click-to-dismiss overlay, not a focusable
  // control (aria-hidden, no keyboard handler on it) -- keyboard users
  // need Escape to close the dropdown instead.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
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

  const focusOption = useCallback((index: number) => {
    optionRefs.current[index]?.focus();
  }, []);

  function selectLanguage(code: Language['code']) {
    setLocale(code);
    setIsOpen(false);
  }

  /** Down-arrow hands focus from the query field to the list, so the whole
   * selector is reachable without leaving the keyboard. Enter still takes
   * the top match directly, which is faster when the query is unambiguous. */
  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (filteredLanguages.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(0);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(filteredLanguages.length - 1);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      selectLanguage(filteredLanguages[0].code);
    }
  }

  /** Arrow keys walk the list and wrap; ArrowUp off the first row returns to
   * the query field rather than wrapping, so backing out feels like undo.
   * Any printable character jumps back to the field and keeps typing. */
  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = filteredLanguages.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusOption(index === lastIndex ? 0 : index + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (index === 0) inputRef.current?.focus();
        else focusOption(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusOption(0);
        break;
      case 'End':
        event.preventDefault();
        focusOption(lastIndex);
        break;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          inputRef.current?.focus();
        }
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
        className="group relative flex cursor-pointer items-center gap-2 px-4 py-2.5"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Doodle background */}
        <svg className="absolute inset-0 h-full w-full">
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
          className="relative h-5 w-5 text-[#00AB39] transition-colors group-hover:text-[#006b24]"
          strokeWidth={2.5}
        />
        <span
          className="relative text-lg text-[#1A1A1D] transition-colors group-hover:text-[#006b24]"
          style={{ fontFamily: 'Patrick Hand, cursive' }}
        >
          {currentLanguage.name}
        </span>

        {/* Arrow indicator */}
        <motion.svg
          className="relative h-4 w-4 text-[#00AB39]"
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
          className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#00AB39]"
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
              className="absolute top-full right-0 z-50 mt-2 w-52"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Shadow */}
              <div className="absolute inset-0 translate-y-2 transform bg-black/20 blur-xl" />

              {/* Menu background */}
              <svg className="absolute inset-0 h-full w-full">
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

              {/* pt-3.5 clears the panel's double stroke, which the search
                  box used to sit right on top of. */}
              <div className="relative px-2 pt-3.5 pb-2">
                {/* Search / autocomplete input */}
                <div className="relative mb-2 flex items-center gap-2 rounded-lg border-2 border-[#5D4E37]/20 bg-white px-2.5 py-1.5">
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

                {/* Menu items. The horizontal padding on the scroll area
                    gives each row's offset block somewhere to land instead
                    of being clipped by the panel edge. */}
                <div
                  id="language-selector-list"
                  role="listbox"
                  className="max-h-44 overflow-x-hidden overflow-y-auto px-0.5 pb-1"
                >
                  {filteredLanguages.length === 0 && (
                    <p className="px-3 py-4 text-center text-sm text-[#5D4E37]/50">
                      No matching language
                    </p>
                  )}
                  {filteredLanguages.map((lang, index) => {
                    const isActive = locale === lang.code;
                    return (
                      <motion.button
                        key={lang.code}
                        ref={(node) => {
                          optionRefs.current[index] = node;
                        }}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => selectLanguage(lang.code)}
                        onKeyDown={(event) => handleOptionKeyDown(event, index)}
                        className="lift-item relative flex w-full cursor-pointer items-center gap-2.5 bg-white px-2.5 py-1.5"
                        style={
                          {
                            '--lift-color': isActive
                              ? '#00AB39'
                              : LIFT_COLORS[index % LIFT_COLORS.length],
                          } as CSSProperties
                        }
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(index, 8) * 0.025 }}
                      >
                        {/* Flag emoji */}
                        <span className="relative text-lg">{lang.flag}</span>

                        {/* Language name */}
                        <span
                          className={`relative text-sm transition-colors ${
                            isActive ? 'text-[#00AB39]' : 'text-[#1A1A1D]'
                          }`}
                          style={{ fontFamily: 'Patrick Hand, cursive' }}
                        >
                          {lang.name}
                        </span>

                        {/* Check mark for active language */}
                        {isActive && (
                          <motion.svg
                            className="relative ml-auto h-3.5 w-3.5 text-[#00AB39]"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </motion.svg>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Decorative corner stars -- both sit low now, since the top
                  corners belong to the search box. */}
              {[
                { bottom: '6px', right: '8px' },
                { bottom: '6px', left: '8px' },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="pointer-events-none absolute h-3 w-3"
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
                  <svg width="12" height="12" viewBox="0 0 16 16">
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
