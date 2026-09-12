/**
 * Pilgrim API contract.
 * Required fields mirror the NOT NULL columns of `pilgrims` in
 * domain_model/schema.ts. Name/contact fields travel already encrypted
 * (the column names end in `_encrypted`); plaintext must never be sent.
 */

export interface CreatePilgrimRequest {
  firstName: string;
  lastName1: string;
  lastName2?: string;
  /** YYYY-MM-DD */
  birthDate: string;
  documentType: string;
  documentNumber: string;
  documentSupport?: string;
  gender: string;
  nationality?: string;
  phone: string;
  email?: string;
  addressCountry: string;
  addressStreet: string;
  addressStreet2?: string;
  addressCity: string;
  addressPostalCode: string;
  addressProvince?: string;
  addressMunicipalityCode?: string;
  idPhotoUrl?: string;
  language?: string;
  consentGiven?: boolean;
}

export interface PilgrimSummary {
  id: number;
  firstName: string;
  lastName1: string;
  nationality: string | null;
  language: string | null;
}
