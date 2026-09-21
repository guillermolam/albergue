import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon, XIcon } from '../doodle/DoodleIcons';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

const RESTAURANT_IMAGES: GalleryImage[] = [
  {
    src: '/albergue/bar_rest_01.jpg',
    alt: 'Interior del restaurante Alqantara Plaza',
    caption: 'Interior acogedor con terraza',
  },
  {
    src: '/albergue/bar_rest_02.jpg',
    alt: 'Zona de mesas y barra',
    caption: 'Zona de mesas y barra',
  },
  {
    src: '/albergue/patio_interior.webp',
    alt: 'Patio interior del albergue',
    caption: 'Patio interior para eventos',
  },
  {
    src: '/albergue/patio_interior2.webp',
    alt: 'Vista del patio desde otra ángulo',
    caption: 'Terraza exterior con vistas',
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

function NavButton({
  onClick,
  label,
  icon,
  disabled,
}: Readonly<{ onClick: () => void; label: string; icon: ReactNode; disabled?: boolean }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#5D4E37]/30 bg-white/90 text-[#5D4E37] hover:bg-[#f5f0e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5D4E37] transition-all ${
        disabled ? 'opacity-30 cursor-not-allowed' : ''
      }`}
    >
      {icon}
    </button>
  );
}

function GalleryThumbnail({
  image,
  isActive,
  onClick,
}: Readonly<{ image: GalleryImage; isActive: boolean; onClick: () => void }>) {
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
}: Readonly<{ images: GalleryImage[]; initialIndex: number; onClose: () => void }>) {
  const [index, setIndex] = useState(initialIndex);
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const goTo = (next: number) => {
    setIndex((next + images.length) % images.length);
  };

  const image = images[index];

  return (
    <motion.div
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
        type="button"
        onClick={onClose}
        aria-label={t.close}
        className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <XIcon className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        disabled={false}
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
        onClick={() => goTo(index + 1)}
        disabled={false}
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
              src={RESTAURANT_IMAGES[currentIndex].src}
              alt={RESTAURANT_IMAGES[currentIndex].alt}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
            />
            {RESTAURANT_IMAGES[currentIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent text-white text-center">
                <p className="text-sm font-handwritten">
                  {RESTAURANT_IMAGES[currentIndex].caption}
                </p>
              </div>
            )}
          </motion.div>

          <button
            type="button"
            onClick={() =>
              setCurrentIndex((i) => (i - 1 + RESTAURANT_IMAGES.length) % RESTAURANT_IMAGES.length)
            }
            aria-label={t.prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:-translate-x-14 z-10"
          >
            <NavButton
              onClick={() =>
                setCurrentIndex(
                  (i) => (i - 1 + RESTAURANT_IMAGES.length) % RESTAURANT_IMAGES.length
                )
              }
              label={t.prev}
              icon={<ChevronLeftIcon className="h-5 w-5" />}
            />
          </button>

          <button
            type="button"
            onClick={() => setCurrentIndex((i) => (i + 1) % RESTAURANT_IMAGES.length)}
            aria-label={t.next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-14 z-10"
          >
            <NavButton
              onClick={() => setCurrentIndex((i) => (i + 1) % RESTAURANT_IMAGES.length)}
              label={t.next}
              icon={<ChevronRightIcon className="h-5 w-5" />}
            />
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {RESTAURANT_IMAGES.map((image, i) => (
              <GalleryThumbnail
                key={i}
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
          images={RESTAURANT_IMAGES}
          initialIndex={currentIndex}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
