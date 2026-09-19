// Frontend-local mirror of the backend's HostelAggregate JSON shape
// (backend/src/types/index.ts). Kept local rather than imported cross-package
// since the rest of this codebase's Astro pages define their own response
// types next to where they're consumed (see admin/bookings.astro's
// `BookingRow`) rather than sharing backend-internal types.

export interface HostelSocialLink {
  id: number;
  platform: string;
  url: string;
}

export interface HostelCertification {
  id: number;
  nameEs: string;
  nameEn: string;
  badgeIconName: string | null;
}

export interface HostelComplianceBadge {
  id: number;
  code: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string | null;
  descriptionEn: string | null;
}

export interface HostelService {
  id: number;
  titleEs: string;
  titleEn: string;
  descriptionEs: string | null;
  descriptionEn: string | null;
  price: string | null;
  currency: string | null;
  iconName: string | null;
}

export interface HostelOpeningHours {
  id: number;
  area: string | null;
  dayOfWeek: number;
  opensAt: string | null;
  closesAt: string | null;
  isClosed: boolean | null;
}

export interface HostelBed {
  id: number;
  position: 'bottom' | 'top' | 'single';
  label: string | null;
  operationalBedId: number | null;
}

export interface HostelBedBunk {
  id: number;
  bunkNumber: number;
  beds: HostelBed[];
}

export interface HostelBedroom {
  id: number;
  roomNumber: string;
  nameEs: string;
  nameEn: string;
  roomType: string | null;
  floor: number | null;
  descriptionEs: string | null;
  descriptionEn: string | null;
  bedBunks: HostelBedBunk[];
}

export interface HostelBuilding {
  id: number;
  nameEs: string;
  nameEn: string;
  descriptionMarkdownEs: string | null;
  descriptionMarkdownEn: string | null;
  floorCount: number | null;
  bedrooms: HostelBedroom[];
}

export interface HostelAggregate {
  id: number;
  nameEs: string;
  nameEn: string;
  taglineEs: string | null;
  taglineEn: string | null;
  aboutMarkdownEs: string | null;
  aboutMarkdownEn: string | null;
  historyMarkdownEs: string | null;
  historyMarkdownEn: string | null;
  logoUrl: string | null;
  heroImageUrl: string | null;
  addressStreet: string | null;
  addressPostalCode: string | null;
  addressCity: string | null;
  addressRegion: string | null;
  addressCountry: string | null;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
  email: string | null;
  checkInFrom: string | null;
  checkInUntil: string | null;
  checkOutBefore: string | null;
  touristicRegistry: string | null;
  cif: string | null;
  ruralTourismLicense: string | null;
  dataProtectionOfficer: string | null;
  rgpdRegistry: string | null;
  arbitrationBoard: string | null;
  arbitrationUrl: string | null;
  odrPlatform: string | null;
  accessibilityLevel: string | null;
  liabilityInsurance: string | null;
  insuranceCompany: string | null;
  paymentMethods: string[] | null;
  socialLinks: HostelSocialLink[];
  certifications: HostelCertification[];
  complianceBadges: HostelComplianceBadge[];
  services: HostelService[];
  openingHours: HostelOpeningHours[];
  buildings: HostelBuilding[];
}

export interface HostelStats {
  bedroomCount: number;
  totalBeds: number;
  availableBeds: number;
  minPricePerNight: string | null;
}
