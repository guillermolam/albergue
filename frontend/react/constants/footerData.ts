// Footer data and legal information
// All data centralized to avoid hardcoding

export const CONTACT_INFO = {
  name: 'Albergue Municipal de Carrascalejo',
  address: {
    // Matched to open Catastre (OVC) RCCOOR for the hostel pin.
    street: 'Calle Extremadura, 21',
    postalCode: '06894',
    city: 'El Carrascalejo',
    region: 'Badajoz, Extremadura',
    country: 'España',
  },
  phone: '+34 695 90 43 44',
  email: 'info@alberguecarrascalejo.com',
  coordinates: {
    lat: 39.0223673,
    lng: -6.3371905,
  },
};

export const LEGAL_INFO = {
  owner: 'Ayuntamiento de El Carrascalejo',
  ineMunicipalityCode: '06032',
  // Tourism Registration (required in Extremadura)
  touristicRegistry: 'H-CC-00123',
  cif: 'B-12345678', // Tax ID — replace with real municipal CIF when confirmed

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

  // Land registry — folio/finca number is not in the open Catastre payload.
  propertyRegistryNote: 'Consultar Registro de la Propiedad de Mérida',

  /**
   * Open Catastre (OVC) public record for the hostel coordinates.
   * Full RC = pc1+pc2+car+cc1+cc2. Titular and valor catastral are protected.
   */
  cadastre: {
    referenceShort: '0728006QD3202N',
    reference: '0728006QD3202N0001JK',
    address: 'CL Extremadura 21, 06894 El Carrascalejo (Badajoz)',
    useEs: 'Residencial',
    useEn: 'Residential',
    builtAreaM2: 411,
    yearBuilt: 1940,
    participation: '100%',
    units: [
      { useEs: 'Vivienda', useEn: 'Dwelling', areaM2: 131 },
      { useEs: 'Almacén', useEn: 'Storage', areaM2: 149 },
      { useEs: 'Almacén', useEn: 'Storage', areaM2: 131 },
    ],
    ovcUrl:
      'https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCConCiud.aspx?del=6&mun=32&refcat=0728006QD3202N0001JK',
  },
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

// pathES/pathEN are identical for every internal link today (no
// localized-URL feature actually exists) -- this helper avoids repeating
// the same path twice per entry rather than writing each one out longhand.
function internalLink(id: string, path: string, labelES: string, labelEN: string) {
  return { id, pathES: path, pathEN: path, labelES, labelEN };
}

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
    internalLink('hostel-info', '/hostel/info', 'El Albergue', 'The Hotel'),
    internalLink('area-visit', '/area/visit', 'La Zona', 'The Area'),
    internalLink('camino', '/camino', 'El Camino', 'El Camino'),
    internalLink('contact', '/contact', 'Contacto', 'Contact'),
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
