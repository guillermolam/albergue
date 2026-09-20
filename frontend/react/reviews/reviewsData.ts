/**
 * Real guest reviews, sourced from Booking.com and TripAdvisor listings for
 * this hostel (scraped 2026-09-20). Quotes are verbatim short excerpts as
 * displayed publicly on those platforms -- first names and country only,
 * matching how the platforms themselves attribute them. Booking.com shows
 * an aggregate /10 score (see BOOKING_AGGREGATE below) but not a per-review
 * star count in its review-snippet cards, so individual Booking reviews
 * carry no `rating` field here rather than a fabricated one.
 */

export type ReviewSource = 'booking' | 'tripadvisor';

export interface Review {
  id: string;
  author: string;
  country: string;
  source: ReviewSource;
  quote: string;
  rating?: number;
  date?: string;
}

export const BOOKING_AGGREGATE = {
  score: 9.1,
  reviewCount: 104,
  label: 'Fantástico',
  sourceUrl: 'https://www.booking.com/hotel/es/albergue-peregrinos-el-carrascalejo.es.html',
  categories: [
    { label: 'Personal', score: 9.7 },
    { label: 'Instalaciones y servicios', score: 9.1 },
    { label: 'Limpieza', score: 9.6 },
    { label: 'Confort', score: 9.4 },
    { label: 'Relación calidad-precio', score: 9.5 },
    { label: 'Ubicación', score: 9.2 },
  ],
} as const;

export const REVIEWS: Review[] = [
  {
    id: 'booking-gomez',
    author: 'Gomez',
    country: 'España',
    source: 'booking',
    quote:
      'Un lugar muy agradable para pasar un día o varios de descanso. La pareja que lo lleva es muy acogedora.',
  },
  {
    id: 'booking-marcelo',
    author: 'Marcelo',
    country: 'España',
    source: 'booking',
    quote:
      'El personal es muy amable y el servicio prestado en el albergue junto con los baños son cómodos y muy limpios.',
  },
  {
    id: 'booking-adriano',
    author: 'Adriano',
    country: 'España',
    source: 'booking',
    quote: 'TODO PERFECTO!!! Y EL POSTRE DE AGUACATE Y PISTACHOS....INCREIBLE!!!!!',
  },
  {
    id: 'booking-francisco',
    author: 'Francisco',
    country: 'España',
    source: 'booking',
    quote:
      'La ubicación en un pueblo muy tranquilo, la cama era muy cómoda y la amabilidad de la dueña.',
  },
  {
    id: 'booking-bona',
    author: 'Bona',
    country: 'Francia',
    source: 'booking',
    quote: 'Atención del personal excepcional, lugar muy muy tranquilo',
  },
  {
    id: 'booking-alejandro-1',
    author: 'Alejandro',
    country: 'España',
    source: 'booking',
    quote:
      'Cada vez me gusta más quedarme en este albergue. Buen trato, buena gente y muy limpio todo.',
  },
  {
    id: 'booking-alejandro-2',
    author: 'Alejandro',
    country: 'España',
    source: 'booking',
    quote:
      'Chelo y Juan son encantadores y tienen el albergue limpísimo y con muy buen ambiente. Las camas muy cómodas, los baños super limpios y el trato muy cercano. Me sentí como en casa.',
  },
  {
    id: 'booking-silvia',
    author: 'Silvia',
    country: 'España',
    source: 'booking',
    quote: 'La zona es hermosa. Me sorprendió gratamente todo: limpieza, comodidad, seguridad.',
  },
  {
    id: 'booking-alejandro-3',
    author: 'Alejandro',
    country: 'España',
    source: 'booking',
    quote:
      'El personal un 10, el cocinero un 10+ y las instalaciones perfectas para los peregrinos. Te dejan guardar la bici dentro. Las habitaciones con A/A.',
  },
  {
    id: 'booking-ilde',
    author: 'Ilde',
    country: 'España',
    source: 'booking',
    quote:
      'La ubicación es perfecta y la calidad precio es una pasada. La comida se puede comer de lujo.',
  },
  {
    id: 'tripadvisor-huguette',
    author: 'huguette p',
    country: 'Francia',
    source: 'tripadvisor',
    rating: 5,
    date: '2026-04-28',
    quote:
      "L'albergue est grande, moderne, très propre et très tranquille. Les hôtes sont très accueillants et font tout leur possible pour que le séjour de leurs clients se passe du mieux possible.",
  },
];
