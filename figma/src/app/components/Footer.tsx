import { motion } from 'motion/react';
import { Facebook, Instagram, Twitter, Youtube, Star, MapPin, Phone, Mail, ExternalLink, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { 
  CONTACT_INFO, 
  LEGAL_INFO, 
  SOCIAL_MEDIA, 
  CERTIFICATIONS, 
  QUICK_LINKS,
  COMPLIANCE_BADGES 
} from '../constants/footerData';
import logoImage from 'figma:asset/6340c39809bbb6dce9c21e3fed2ac80a388b79b7.png';
import {
  ExtremaduraFlag,
  MeridaFlag,
  CarrascalejoFlag,
  SparkleIcon
} from './doodle/DoodleIcons';

const iconMap: Record<string, React.ComponentType<any>> = {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Star
};

export function Footer() {
  const navigate = useNavigate();
  const { language } = useI18n();

  const handleLegalNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#006b24] text-white overflow-x-hidden border-t-6 border-[#00AB39]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.img
              src={logoImage}
              alt="Logo"
              className="w-24 h-24 mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <h3 className="text-2xl sketch-title mb-4">{CONTACT_INFO.name}</h3>
            <p className="text-[#E8F5E9] mb-4 hand-drawn text-sm leading-relaxed">
              {language === 'es' 
                ? 'Albergue oficial en el Camino de Santiago. Acogiendo peregrinos desde 1995.'
                : 'Official hostel on the Camino de Santiago. Welcoming pilgrims since 1995.'}
            </p>

            {/* Flags */}
            <div className="flex gap-3 mb-4">
              <ExtremaduraFlag className="w-12 h-8" />
              <MeridaFlag className="w-12 h-8" />
              <CarrascalejoFlag className="w-12 h-8" />
            </div>

            {/* Tourism Registry Badge */}
            <div className="bg-[#00AB39] rounded-xl p-3 border-3 border-white inline-block">
              <p className="text-xs text-white hand-drawn">
                <strong>{language === 'es' ? 'Registro Turístico' : 'Tourism Registry'}:</strong><br />
                {LEGAL_INFO.touristicRegistry}
              </p>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-xl sketch-title mb-6 flex items-center gap-2">
              <SparkleIcon className="w-6 h-6" />
              {language === 'es' ? 'Enlaces Rápidos' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.internal.map((link) => (
                <li key={link.id}>
                  <motion.button
                    onClick={() => {
                      navigate(language === 'es' ? link.pathES : link.pathEN);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[#E8F5E9] hover:text-white transition-colors text-left hand-drawn"
                    whileHover={{ x: 5 }}
                  >
                    → {language === 'es' ? link.labelES : link.labelEN}
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
                    → {language === 'es' ? link.labelES : link.labelEN}
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-xl sketch-title mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6" />
              {language === 'es' ? 'Contacto' : 'Contact'}
            </h4>
            <div className="space-y-4 text-sm">
              <motion.div 
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
              >
                <MapPin className="w-5 h-5 text-[#00AB39] flex-shrink-0 mt-0.5" />
                <div className="text-[#E8F5E9] hand-drawn">
                  {CONTACT_INFO.address.street}<br />
                  {CONTACT_INFO.address.postalCode} {CONTACT_INFO.address.city}<br />
                  {CONTACT_INFO.address.region}, {CONTACT_INFO.address.country}
                </div>
              </motion.div>

              <motion.a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-3 text-[#E8F5E9] hover:text-white transition-colors hand-drawn"
                whileHover={{ x: 5 }}
              >
                <Phone className="w-5 h-5 text-[#00AB39] flex-shrink-0" />
                {CONTACT_INFO.phone}
              </motion.a>

              <motion.a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-3 text-[#E8F5E9] hover:text-white transition-colors hand-drawn"
                whileHover={{ x: 5 }}
              >
                <Mail className="w-5 h-5 text-[#00AB39] flex-shrink-0" />
                {CONTACT_INFO.email}
              </motion.a>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <p className="text-sm mb-3 hand-drawn">{language === 'es' ? 'Síguenos' : 'Follow Us'}:</p>
              <div className="flex gap-3">
                {SOCIAL_MEDIA.map((social) => {
                  const Icon = iconMap[social.icon];
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

          {/* Column 4: Certifications & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-xl sketch-title mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              {language === 'es' ? 'Certificaciones' : 'Certifications'}
            </h4>
            
            <div className="space-y-3 mb-6">
              {CERTIFICATIONS.map((cert) => (
                <motion.div
                  key={cert.id}
                  className="bg-white/10 rounded-lg p-2 border-2 border-[#00AB39] text-xs hand-drawn hover:bg-white/15 transition-colors"
                  whileHover={{ scale: 1.03 }}
                >
                  ✓ {language === 'es' ? cert.nameES : cert.nameEN}
                </motion.div>
              ))}
            </div>

            {/* Compliance Badges */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {Object.entries(COMPLIANCE_BADGES).map(([key, badge]) => (
                <motion.div
                  key={key}
                  className="bg-[#00AB39] rounded-lg p-2 text-center border-2 border-white"
                  whileHover={{ scale: 1.05 }}
                  title={badge.description}
                >
                  <Shield className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-[10px] hand-drawn leading-tight">
                    {language === 'es' ? badge.nameES : badge.nameEN}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Legal Links */}
            <div className="space-y-2">
              {QUICK_LINKS.legal.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => handleLegalNavigation(language === 'es' ? link.pathES : link.pathEN)}
                  className="block text-xs text-[#E8F5E9] hover:text-white transition-colors underline hand-drawn text-left w-full"
                  whileHover={{ x: 3 }}
                >
                  {language === 'es' ? link.labelES : link.labelEN}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar - Legal Compliance */}
      <div className="border-t-4 border-[#00AB39] bg-[#004d1f] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#E8F5E9]">
            
            {/* Legal Info */}
            <div className="hand-drawn">
              <p className="mb-2">
                <strong className="text-white">
                  {language === 'es' ? 'Información Legal' : 'Legal Information'}:
                </strong>
              </p>
              <p>CIF: {LEGAL_INFO.cif}</p>
              <p>{language === 'es' ? 'Licencia' : 'License'}: {LEGAL_INFO.ruralTourismLicense}</p>
              <p>{language === 'es' ? 'Seguro RC' : 'Liability Insurance'}: {LEGAL_INFO.liabilityInsurance}</p>
            </div>

            {/* Consumer Rights */}
            <div className="hand-drawn">
              <p className="mb-2">
                <strong className="text-white">
                  {language === 'es' ? 'Derechos del Consumidor' : 'Consumer Rights'}:
                </strong>
              </p>
              <motion.a
                href={LEGAL_INFO.arbitrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
                whileHover={{ x: 3 }}
              >
                {language === 'es' ? 'Junta Arbitral de Consumo' : 'Consumer Arbitration Board'}
                <ExternalLink className="w-3 h-3" />
              </motion.a>
              <motion.a
                href={LEGAL_INFO.odrPlatform}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 mt-1"
                whileHover={{ x: 3 }}
              >
                {language === 'es' ? 'Plataforma ODR UE' : 'EU ODR Platform'}
                <ExternalLink className="w-3 h-3" />
              </motion.a>
            </div>

            {/* Copyright */}
            <div className="hand-drawn md:text-right">
              <p className="mb-2">
                <strong className="text-white">© 2025 {CONTACT_INFO.name}</strong>
              </p>
              <p>{language === 'es' ? 'Todos los derechos reservados' : 'All rights reserved'}</p>
              <p className="mt-2 text-[10px]">
                {language === 'es' 
                  ? 'Desarrollado con ❤️ para el Camino de Santiago'
                  : 'Developed with ❤️ for the Camino de Santiago'}
              </p>
            </div>
          </div>

          {/* Accessibility Statement */}
          <div className="mt-6 pt-6 border-t-2 border-[#00AB39] text-center">
            <p className="text-xs text-[#E8F5E9] hand-drawn">
              {language === 'es' 
                ? `Este sitio cumple con ${LEGAL_INFO.accessibilityLevel} y es accesible para personas con discapacidad.`
                : `This site complies with ${LEGAL_INFO.accessibilityLevel} and is accessible for people with disabilities.`}
            </p>
            <p className="text-[10px] text-[#E8F5E9] mt-2 hand-drawn">
              {language === 'es'
                ? 'Cumplimiento: RGPD, LOPD, LSSI, Ley de Turismo de Extremadura 7/1998, RD 933/2021'
                : 'Compliance: GDPR, LOPD, LSSI, Extremadura Tourism Law 7/1998, RD 933/2021'}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-2 bg-gradient-to-r from-[#00AB39] via-[#66BB6A] to-[#00AB39]" />
    </footer>
  );
}