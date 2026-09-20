import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

const COPY = {
  es: { prev: 'Foto anterior', next: 'Foto siguiente', goTo: (n: number) => `Foto ${n}` },
  en: { prev: 'Previous photo', next: 'Next photo', goTo: (n: number) => `Photo ${n}` },
};

export function ImageCarousel({ images, alt }: Readonly<ImageCarouselProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const showControls = images.length > 1;
  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative mb-3 overflow-hidden rounded-lg">
      <img
        src={images[index]}
        alt={`${alt} ${index + 1}/${images.length}`}
        className="h-48 w-full object-cover"
      />

      {showControls && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label={t.prev}
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#00AB39] shadow hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00AB39]"
          >
            <ChevronLeftIcon className="h-5 w-5" animate={false} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={t.next}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#00AB39] shadow hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00AB39]"
          >
            <ChevronRightIcon className="h-5 w-5" animate={false} />
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((image, i) => (
              <button
                key={image}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t.goTo(i + 1)}
                aria-current={i === index}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-[#00AB39]' : 'bg-white/70'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
