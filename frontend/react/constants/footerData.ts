// Footer data and legal information
// All data centralized to avoid hardcoding

export const CONTACT_INFO = {
  name: 'Albergue Municipal de Carrascalejo',
  address: {
    street: 'Calle Principal, 123',
    postalCode: '10680',
    city: 'Carrascalejo',
    region: 'Extremadura',
    country: 'España',
  },
  phone: '+34 924 XXX XXX',
  email: 'info@alberguecarrascalejo.com',
  coordinates: {
    lat: 39.1234,
    lng: -5.6789,
  },
};

export const LEGAL_INFO = {
  // Tourism Registration (required in Extremadura)
  touristicRegistry: 'H-CC-00123',
  cif: 'B-12345678', // Tax ID

  // Rural Tourism License Extremadura
  ruralTourismLicense: 'ATR-EX-2024-001',

  // Data Protection
  dataProtectionOfficer: 'dpo@alberguecarrascalejo.com',
  rgpdRegistry: 'AEPD-R-2024-12345',

  // Consumer arbitration
  arbitrationBoard: 'Junta Arbitral de Consumo de Extremadura',
  arbitrationUrl: 'https://consumo.juntaex.es',

  // Online Dispute Resolution (EU requirement)
  odrPlatform: 'https://ec.europa.eu/consumers/odr',

  // Accessibility
  accessibilityLevel: 'AA WCAG 2.1',

  // Insurance
  liabilityInsurance: 'Póliza RC-123456789',
  insuranceCompany: 'Seguros Turísticos SA',
};

export const SOCIAL_MEDIA = [
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://facebook.com/alberguecarrascalejo',
    icon: 'Facebook',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/alberguecarrascalejo',
    icon: 'Instagram',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    url: 'https://twitter.com/alberguecarrascalejo',
    icon: 'Twitter',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://youtube.com/@alberguecarrascalejo',
    icon: 'Youtube',
  },
  {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    url: 'https://tripadvisor.com/alberguecarrascalejo',
    icon: 'Star',
  },
];

export const CERTIFICATIONS = [
  {
    id: 'camino',
    nameES: 'Albergue Oficial del Camino de Santiago',
    nameEN: 'Official Camino de Santiago Hostel',
    badge: 'camino-official',
  },
  {
    id: 'extremadura',
    nameES: 'Turismo de Extremadura',
    nameEN: 'Extremadura Tourism',
    badge: 'extremadura-tourism',
  },
  {
    id: 'quality',
    nameES: 'Sello de Calidad Turística',
    nameEN: 'Tourism Quality Seal',
    badge: 'quality-seal',
  },
  {
    id: 'accessibility',
    nameES: 'Accesibilidad Universal',
    nameEN: 'Universal Accessibility',
    badge: 'accessibility',
  },
];

export const QUICK_LINKS = {
  internal: [
    {
      id: 'home',
      pathES: '/',
      pathEN: '/',
      labelES: 'Inicio',
      labelEN: 'Home',
    },
    {
      id: 'booking',
      pathES: '/book',
      pathEN: '/book',
      labelES: 'Reservar',
      labelEN: 'Book Now',
    },
    {
      id: 'dashboard',
      pathES: '/dashboard',
      pathEN: '/dashboard',
      labelES: 'Mi Reserva',
      labelEN: 'My Booking',
    },
    {
      id: 'hostel-info',
      pathES: '/hostel/info',
      pathEN: '/hostel/info',
      labelES: 'El Albergue',
      labelEN: 'The Hotel',
    },
    {
      id: 'area-visit',
      pathES: '/area/visit',
      pathEN: '/area/visit',
      labelES: 'La Zona',
      labelEN: 'The Area',
    },
    {
      id: 'camino',
      pathES: '/camino',
      pathEN: '/camino',
      labelES: 'El Camino',
      labelEN: 'El Camino',
    },
    {
      id: 'contact',
      pathES: '/contact',
      pathEN: '/contact',
      labelES: 'Contacto',
      labelEN: 'Contact',
    },
  ],
  legal: [
    {
      id: 'privacy',
      pathES: '/privacidad',
      pathEN: '/privacy',
      labelES: 'Política de Privacidad',
      labelEN: 'Privacy Policy',
    },
    {
      id: 'terms',
      pathES: '/terminos',
      pathEN: '/terms',
      labelES: 'Términos y Condiciones',
      labelEN: 'Terms & Conditions',
    },
    {
      id: 'cookies',
      pathES: '/cookies',
      pathEN: '/cookies',
      labelES: 'Política de Cookies',
      labelEN: 'Cookie Policy',
    },
    {
      id: 'legal',
      pathES: '/aviso-legal',
      pathEN: '/legal-notice',
      labelES: 'Aviso Legal',
      labelEN: 'Legal Notice',
    },
  ],
  external: [
    {
      id: 'camino-info',
      url: 'https://www.caminodesantiago.gal',
      labelES: 'Info del Camino',
      labelEN: 'Camino Info',
    },
    {
      id: 'extremadura-tourism',
      url: 'https://www.turismoextremadura.com',
      labelES: 'Turismo Extremadura',
      labelEN: 'Extremadura Tourism',
    },
    {
      id: 'consumer-rights',
      url: 'https://consumo.juntaex.es',
      labelES: 'Derechos del Consumidor',
      labelEN: 'Consumer Rights',
    },
  ],
};

export const PAYMENT_METHODS = ['visa', 'mastercard', 'amex', 'paypal', 'bizum', 'cash'];

export const COMPLIANCE_BADGES = {
  gdpr: {
    nameES: 'Cumplimiento RGPD',
    nameEN: 'GDPR Compliant',
    description: 'Reglamento General de Protección de Datos',
  },
  lssi: {
    nameES: 'Cumplimiento LSSI',
    nameEN: 'LSSI Compliant',
    description: 'Ley de Servicios de la Sociedad de la Información',
  },
  lopd: {
    nameES: 'Cumplimiento LOPD',
    nameEN: 'LOPD Compliant',
    description: 'Ley Orgánica de Protección de Datos',
  },
  ssl: {
    nameES: 'Conexión Segura SSL',
    nameEN: 'SSL Secure Connection',
    description: 'Certificado SSL/TLS',
  },
};
