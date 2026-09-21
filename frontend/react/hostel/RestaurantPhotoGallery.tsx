import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon, XIcon } from '../doodle/DoodleIcons';

interface GalleryImage {
  src: string;
  alt: { es: string; en: string };
  caption: { es: string; en: string };
}

const RESTAURANT_IMAGES: GalleryImage[] = [
  {
    src: '/albergue/bar_rest_01.jpg',
    alt: {
      es: 'Interior del restaurante Alqantara Plaza',
      en: 'Interior of Alqantara Plaza restaurant',
    },
    caption: {
      es: 'Interior acogedor con terraza',
      en: 'Cozy interior with terrace',
    },
  },
  {
    src: '/albergue/bar_rest_02.jpg',
    alt: {
      es: 'Zona de mesas y barra',
      en: 'Dining tables and bar area',
    },
    caption: {
      es: 'Zona de mesas y barra',
      en: 'Tables and bar',
    },
  },
  {
    src: '/albergue/patio_interior.webp',
    alt: {
      es: 'Patio interior del albergue',
      en: 'Hostel interior patio',
    },
    caption: {
      es: 'Patio interior para eventos',
      en: 'Interior patio for events',
    },
  },
  {
    src: '/albergue/patio_interior2.webp',
    alt: {
      es: 'Vista del patio desde otro ángulo',
      en: 'Patio view from another angle',
    },
    caption: {
      es: 'Terraza exterior con vistas',
      en: 'Outdoor terrace with views',
    },
  },
];

const COPY = {
  es: {
    title: 'Galería de Fotos',
    subtitle: 'Descubre el ambiente de Alqantara Plaza',
    expand: 'Ver a pantalla completa',
    close: 'Cerrar',
    prev: 'Foto anterior',
    next: 'Foto siguiente',
  },
  en: {
    title: 'Photo Gallery',
    subtitle: 'Discover the atmosphere of Alqantara Plaza',
    expand: 'View fullscreen',
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
  },
} as const;

function localize(image: GalleryImage, isEs: boolean) {
  return {
    src: image.src,
    alt: isEs ? image.alt.es : image.alt.en,
    caption: isEs ? image.caption.es : image.caption.en,
  };
}

function NavButton({
  onClick,
  label,
  icon,
  disabled,
  className = '',
}: Readonly<{
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  className?: string;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#5D4E37]/30 bg-white/90 text-[#5D4E37] hover:bg-[#f5f0e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5D4E37] transition-all ${
        disabled ? 'opacity-30 cursor-not-allowed' : ''
      } ${className}`}
    >
      {icon}
    </button>
  );
}

function GalleryThumbnail({
  image,
  isActive,
  onClick,
}: Readonly<{
  image: { src: string; alt: string; caption: string };
  isActive: boolean;
  onClick: () => void;
}>) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
        isActive
          ? 'border-[#00AB39] ring-2 ring-[#00AB39]/30 scale-105'
          : 'border-[#5D4E37]/20 hover:border-[#5D4E37]/40'
      }`}
      whileHover={{ scale: isActive ? 1.02 : 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <img src={image.src} alt={image.alt} className="h-20 w-full object-cover" loading="lazy" />
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-2"
        >
          <span className="w-full text-xs text-white font-medium truncate font-handwritten">
            {image.caption}
          </span>
        </motion.div>
      )}
    </motion.button>
  );
}

function FullscreenModal({
  images,
  initialIndex,
  onClose,
  isEs,
}: Readonly<{
  images: ReturnType<typeof localize>[];
  initialIndex: number;
  onClose: () => void;
  isEs: boolean;
}>) {
  const [index, setIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const t = isEs ? COPY.es : COPY.en;

  const goTo = (next: number) => {
    setIndex((next + images.length) % images.length);
  };

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(index - 1);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(index + 1);
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [onClose, index, images.length]);

  const image = images[index];

  return (
    <motion.div
      ref={dialogRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.expand}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label={t.close}
        className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <XIcon className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goTo(index - 1);
        }}
        aria-label={t.prev}
        className="absolute left-4 z-10 flex h-full items-center px-4 text-white hover:text-[#00AB39] transition-colors"
      >
        <ChevronLeftIcon className="h-8 w-8" />
      </button>

      <motion.div
        key={image.src}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={image.src} alt={image.alt} className="max-h-[85vh] max-w-[90vw] object-contain" />
        {image.caption && (
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent text-white text-center">
            <p className="text-sm font-handwritten">{image.caption}</p>
            <p className="text-xs text-white/60 mt-1">
              {index + 1} / {images.length}
            </p>
          </div>
        )}
      </motion.div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goTo(index + 1);
        }}
        aria-label={t.next}
        className="absolute right-4 z-10 flex h-full items-center px-4 text-white hover:text-[#00AB39] transition-colors"
      >
        <ChevronRightIcon className="h-8 w-8" />
      </button>
    </motion.div>
  );
}

export function RestaurantPhotoGallery() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const images = RESTAURANT_IMAGES.map((img) => localize(img, isEs));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="py-12 bg-[#fafafa]">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-[#00AB39]">{t.title}</p>
          <h2 className="mt-1 text-2xl font-bold text-[#5D4E37] font-sketch">{t.subtitle}</h2>
        </div>

        <div className="relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="relative aspect-[4/3] max-w-3xl mx-auto rounded-xl overflow-hidden border-2 border-[#5D4E37]/20 bg-[#f5f0e8] doodle-shadow"
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
            />
            {images[currentIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent text-white text-center">
                <p className="text-sm font-handwritten">{images[currentIndex].caption}</p>
              </div>
            )}
          </motion.div>

          <NavButton
            onClick={() => setCurrentIndex((i) => (i - 1 + images.length) % images.length)}
            label={t.prev}
            icon={<ChevronLeftIcon className="h-5 w-5" />}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:-translate-x-14 z-10"
          />

          <NavButton
            onClick={() => setCurrentIndex((i) => (i + 1) % images.length)}
            label={t.next}
            icon={<ChevronRightIcon className="h-5 w-5" />}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-14 z-10"
          />

          <div className="mt-6 flex justify-center gap-2">
            {images.map((image, i) => (
              <GalleryThumbnail
                key={image.src}
                image={image}
                isActive={i === currentIndex}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-4 mx-auto flex items-center justify-center gap-2 rounded-full border-2 border-[#5D4E37]/30 bg-white px-4 py-2 text-sm text-[#5D4E37] font-sketch hover:border-[#00AB39] hover:text-[#00AB39] hover:bg-[#f5f0e8] transition-all"
          >
            <ExpandIcon className="h-4 w-4" />
            <span>{t.expand}</span>
          </button>
        </div>
      </div>

      {showModal && (
        <FullscreenModal
          images={images}
          initialIndex={currentIndex}
          onClose={() => setShowModal(false)}
          isEs={isEs}
        />
      )}
    </section>
  );
}
