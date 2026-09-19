export type PlaceCategory =
  | 'restaurant'
  | 'bar'
  | 'night_club'
  | 'museum'
  | 'trail'
  | 'park'
  | 'excursion'
  | 'pharmacy'
  | 'atm'
  | 'medical'
  | 'transport'
  | 'supermarket'
  | 'other';

export interface PlaceAddress {
  id: number;
  label: string | null;
  street: string;
  city: string;
  postalCode: string | null;
  province: string | null;
  country: string | null;
  isPrimary: boolean | null;
}

export interface PlacePhone {
  id: number;
  label: string | null;
  phoneNumber: string;
  isPrimary: boolean | null;
}

export interface PlaceImage {
  id: number;
  url: string;
  altTextEs: string | null;
  altTextEn: string | null;
}

export interface PlaceLabel {
  id: number;
  labelEs: string;
  labelEn: string;
}

export interface PlacePrice {
  id: number;
  labelEs: string;
  labelEn: string;
  amount: string;
  currency: string | null;
}

export interface PlaceWithDetails {
  id: number;
  slug: string;
  category: PlaceCategory;
  nameEs: string;
  nameEn: string;
  shortDescriptionEs: string | null;
  shortDescriptionEn: string | null;
  descriptionMarkdownEs: string | null;
  descriptionMarkdownEn: string | null;
  avatarUrl: string | null;
  iconName: string | null;
  rating: string | null;
  ratingCount: number | null;
  priceLevel: number | null;
  latitude: string | null;
  longitude: string | null;
  websiteUrl: string | null;
  addresses: PlaceAddress[];
  phones: PlacePhone[];
  images: PlaceImage[];
  labels: PlaceLabel[];
  prices: PlacePrice[];
}
