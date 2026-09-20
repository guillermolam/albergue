import { motion } from 'motion/react';
import {
  StarIcon as Star,
  MapPinIcon as MapPin,
  PhoneIcon as Phone,
  MailIcon as Mail,
  ExternalLinkIcon as ExternalLink,
  ShieldIcon as Shield,
} from './doodle/DoodleIcons';
import type { ComponentType } from 'react';
import { useI18n } from './hooks/useI18n';
import {
  CONTACT_INFO,
  LEGAL_INFO,
  SOCIAL_MEDIA,
  CERTIFICATIONS,
  QUICK_LINKS,
  COMPLIANCE_BADGES,
} from './constants/footerData';
import { ExtremaduraFlag, MeridaFlag, CarrascalejoFlag, SparkleIcon } from './doodle/DoodleIcons';
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from './doodle/SocialIcons';
import type { HostelAggregate } from '../src/lib/hostelTypes';

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
  star: Star,
  tripadvisor: Star,
};

export interface FooterProps {
  /** Backend-sourced hostel content (contact/legal/social/certifications).
   * Falls back to the static footerData.ts constants when omitted or when
   * the SSR fetch that produced it failed -- QUICK_LINKS (route wiring, not
   * hostel content) always comes from footerData.ts regardless. */
  hostelInfo?: HostelAggregate | null;
}

/** Extracted so Footer's own cognitive complexity stays under SonarCloud's
 * threshold -- two independent .map() calls plus their ternaries were
 * counted against the parent function before. */
function FooterQuickLinksColumn({ isEs, goTo }: { isEs: boolean; goTo: (path: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
    >
      <h4 className="text-xl sketch-title mb-6 flex items-center gap-2">
        <SparkleIcon className="w-6 h-6" />
        {isEs ? 'Enlaces Rápidos' : 'Quick Links'}
      </h4>
      <ul className="space-y-3">
        {QUICK_LINKS.internal.map((link) => (
          <li key={link.id}>
            <motion.button
              onClick={() => goTo(isEs ? link.pathES : link.pathEN)}
              className="text-[#E8F5E9] hover:text-white transition-colors text-left hand-drawn"
              whileHover={{ x: 5 }}
            >
              → {isEs ? link.labelES : link.labelEN}
            </motion.button>
          </li>
        ))}
        {QUICK_LINKS.external.map((link) => (
          <li key={link.id}>
            <motion.a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E8F5E9] hover:text-white transition-colors flex items-center gap-2 hand-drawn"
              whileHover={{ x: 5 }}
            >
              → {isEs ? link.labelES : link.labelEN}
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

interface FooterCertificationItem {
  id: string;
  nameES: string;
  nameEN: string;
}

interface FooterComplianceBadgeItem {
  key: string;
  nameES: string;
  nameEN: string;
  description: string;
}

function FooterCertificationsColumn({
  isEs,
  goTo,
  certifications,
  complianceBadges,
}: {
  isEs: boolean;
  goTo: (path: string) => void;
  certifications: FooterCertificationItem[];
  complianceBadges: FooterComplianceBadgeItem[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      <h4 className="text-xl sketch-title mb-6 flex items-center gap-2">
        <Shield className="w-6 h-6" />
        {isEs ? 'Certificaciones' : 'Certifications'}
      </h4>

      <div className="space-y-3 mb-6">
        {certifications.map((cert) => (
          <motion.div
            key={cert.id}
            className="bg-white/10 rounded-lg p-2 border-2 border-[#00AB39] text-xs hand-drawn hover:bg-white/15 transition-colors"
            whileHover={{ scale: 1.03 }}
          >
            ✓ {isEs ? cert.nameES : cert.nameEN}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {complianceBadges.map((badge) => (
          <motion.div
            key={badge.key}
            className="bg-[#00AB39] rounded-lg p-2 text-center border-2 border-white"
            whileHover={{ scale: 1.05 }}
            title={badge.description}
          >
            <Shield className="w-5 h-5 mx-auto mb-1" />
            <p className="text-[10px] hand-drawn leading-tight">
              {isEs ? badge.nameES : badge.nameEN}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-2">
        {QUICK_LINKS.legal.map((link) => (
          <motion.button
            key={link.id}
            onClick={() => goTo(isEs ? link.pathES : link.pathEN)}
            className="block text-xs text-[#E8F5E9] hover:text-white transition-colors underline hand-drawn text-left w-full"
            whileHover={{ x: 3 }}
          >
            {isEs ? link.labelES : link.labelEN}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export function Footer({ hostelInfo }: Readonly<FooterProps> = {}) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';

  const goTo = (path: string) => {
    window.location.href = path;
  };

  // Backend-sourced content, reshaped to match footerData.ts's static
  // constant shapes so the JSX below barely changes; falls back to those
  // static constants whenever hostelInfo wasn't provided (backend
  // unreachable at build/request time, or an older cached page).
  const contact = hostelInfo
    ? {
        name: isEs ? hostelInfo.nameEs : hostelInfo.nameEn,
        address: {
          street: hostelInfo.addressStreet ?? CONTACT_INFO.address.street,
          postalCode: hostelInfo.addressPostalCode ?? CONTACT_INFO.address.postalCode,
          city: hostelInfo.addressCity ?? CONTACT_INFO.address.city,
          region: hostelInfo.addressRegion ?? CONTACT_INFO.address.region,
          country: hostelInfo.addressCountry ?? CONTACT_INFO.address.country,
        },
        phone: hostelInfo.phone ?? CONTACT_INFO.phone,
        email: hostelInfo.email ?? CONTACT_INFO.email,
      }
    : CONTACT_INFO;

  const legal = hostelInfo
    ? {
        touristicRegistry: hostelInfo.touristicRegistry ?? '',
        cif: hostelInfo.cif ?? '',
        ruralTourismLicense: hostelInfo.ruralTourismLicense ?? '',
        liabilityInsurance: hostelInfo.liabilityInsurance ?? '',
        arbitrationUrl: hostelInfo.arbitrationUrl ?? '',
        odrPlatform: hostelInfo.odrPlatform ?? '',
        accessibilityLevel: hostelInfo.accessibilityLevel ?? '',
      }
    : LEGAL_INFO;

  const socialLinks = hostelInfo
    ? hostelInfo.socialLinks.map((s) => ({
        id: String(s.id),
        name: s.platform,
        url: s.url,
        icon: s.platform,
      }))
    : SOCIAL_MEDIA;

  const certifications = hostelInfo
    ? hostelInfo.certifications.map((c) => ({
        id: String(c.id),
        nameES: c.nameEs,
        nameEN: c.nameEn,
      }))
    : CERTIFICATIONS;

  const complianceBadges = hostelInfo
    ? hostelInfo.complianceBadges.map((b) => ({
        key: b.code,
        nameES: b.nameEs,
        nameEN: b.nameEn,
        description: (isEs ? b.descriptionEs : b.descriptionEn) ?? '',
      }))
    : Object.entries(COMPLIANCE_BADGES).map(([key, badge]) => ({ key, ...badge }));

  return (
    <footer className="bg-[#006b24] text-white overflow-x-hidden border-t-6 border-[#00AB39]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.img
              src="/logos/logoalbergue-removebg-preview.png"
              alt="Logo"
              className="w-24 h-24 mb-4 object-contain"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <h3 className="text-2xl sketch-title mb-4">{contact.name}</h3>
            <p className="text-[#E8F5E9] mb-4 hand-drawn text-sm leading-relaxed">
              {isEs
                ? 'Albergue oficial en el Camino de Santiago. Acogiendo peregrinos desde 1995.'
                : 'Official hostel on the Camino de Santiago. Welcoming pilgrims since 1995.'}
            </p>

            <div className="flex gap-3 mb-4">
              <ExtremaduraFlag className="w-12 h-8" />
              <MeridaFlag className="w-12 h-8" />
              <CarrascalejoFlag className="w-12 h-8" />
            </div>

            <div className="bg-[#00AB39] rounded-xl p-3 border-3 border-white inline-block">
              <p className="text-xs text-white hand-drawn">
                <strong>{isEs ? 'Registro Turístico' : 'Tourism Registry'}:</strong>
                <br />
                {legal.touristicRegistry}
              </p>
            </div>
          </motion.div>

          <FooterQuickLinksColumn isEs={isEs} goTo={goTo} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-xl sketch-title mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6" />
              {isEs ? 'Contacto' : 'Contact'}
            </h4>
            <div className="space-y-4 text-sm">
              <motion.div className="flex items-start gap-3" whileHover={{ x: 5 }}>
                <MapPin className="w-5 h-5 text-[#00AB39] flex-shrink-0 mt-0.5" />
                <div className="text-[#E8F5E9] hand-drawn">
                  {contact.address.street}
                  <br />
                  {contact.address.postalCode} {contact.address.city}
                  <br />
                  {contact.address.region}, {contact.address.country}
                </div>
              </motion.div>

              <motion.a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-[#E8F5E9] hover:text-white transition-colors hand-drawn"
                whileHover={{ x: 5 }}
              >
                <Phone className="w-5 h-5 text-[#00AB39] flex-shrink-0" />
                {contact.phone}
              </motion.a>

              <motion.a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-[#E8F5E9] hover:text-white transition-colors hand-drawn"
                whileHover={{ x: 5 }}
              >
                <Mail className="w-5 h-5 text-[#00AB39] flex-shrink-0" />
                {contact.email}
              </motion.a>
            </div>

            <div className="mt-6">
              <p className="text-sm mb-3 hand-drawn">{isEs ? 'Síguenos' : 'Follow Us'}:</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = ICON_MAP[social.icon.toLowerCase()];
                  if (!Icon) return null;
                  return (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#00AB39] rounded-full flex items-center justify-center hover:bg-white hover:text-[#006b24] transition-all border-2 border-white"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <FooterCertificationsColumn
            isEs={isEs}
            goTo={goTo}
            certifications={certifications}
            complianceBadges={complianceBadges}
          />
        </div>
      </div>

      <div className="border-t-4 border-[#00AB39] bg-[#004d1f] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#E8F5E9]">
            <div className="hand-drawn">
              <p className="mb-2">
                <strong className="text-white">
                  {isEs ? 'Información Legal' : 'Legal Information'}:
                </strong>
              </p>
              <p>CIF: {legal.cif}</p>
              <p>
                {isEs ? 'Licencia' : 'License'}: {legal.ruralTourismLicense}
              </p>
              <p>
                {isEs ? 'Seguro RC' : 'Liability Insurance'}: {legal.liabilityInsurance}
              </p>
            </div>

            <div className="hand-drawn">
              <p className="mb-2">
                <strong className="text-white">
                  {isEs ? 'Derechos del Consumidor' : 'Consumer Rights'}:
                </strong>
              </p>
              <motion.a
                href={legal.arbitrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
                whileHover={{ x: 3 }}
              >
                {isEs ? 'Junta Arbitral de Consumo' : 'Consumer Arbitration Board'}
                <ExternalLink className="w-3 h-3" />
              </motion.a>
              <motion.a
                href={legal.odrPlatform}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 mt-1"
                whileHover={{ x: 3 }}
              >
                {isEs ? 'Plataforma ODR UE' : 'EU ODR Platform'}
                <ExternalLink className="w-3 h-3" />
              </motion.a>
            </div>

            <div className="hand-drawn md:text-right">
              <p className="mb-2">
                <strong className="text-white">© 2025 {contact.name}</strong>
              </p>
              <p>{isEs ? 'Todos los derechos reservados' : 'All rights reserved'}</p>
              <p className="mt-2 text-[10px]">
                {isEs
                  ? 'Desarrollado con ❤️ para el Camino de Santiago'
                  : 'Developed with ❤️ for the Camino de Santiago'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-[#00AB39] text-center">
            <p className="text-xs text-[#E8F5E9] hand-drawn">
              {isEs
                ? `Este sitio cumple con ${legal.accessibilityLevel} y es accesible para personas con discapacidad.`
                : `This site complies with ${legal.accessibilityLevel} and is accessible for people with disabilities.`}
            </p>
            <p className="text-[10px] text-[#E8F5E9] mt-2 hand-drawn">
              {isEs
                ? 'Cumplimiento: RGPD, LOPD, LSSI, Ley de Turismo de Extremadura 7/1998, RD 933/2021'
                : 'Compliance: GDPR, LOPD, LSSI, Extremadura Tourism Law 7/1998, RD 933/2021'}
            </p>
          </div>
        </div>
      </div>

      <div className="h-2 bg-gradient-to-r from-[#00AB39] via-[#66BB6A] to-[#00AB39]" />
    </footer>
  );
}
