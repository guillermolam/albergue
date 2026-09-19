import { motion } from "motion/react";
import { Shield, Lock, Eye, FileText, Mail } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";
import { useNavigate } from "react-router-dom";
import { DoodleCard } from "./doodle/DoodleCard";
import { CONTACT_INFO, LEGAL_INFO } from "../constants/footerData";
import logoImage from "figma:asset/6340c39809bbb6dce9c21e3fed2ac80a388b79b7.png";

export function PrivacyPolicy() {
  const { language } = useI18n();
  const navigate = useNavigate();

  const content = {
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última actualización: 20 de Diciembre de 2025",
      sections: [
        {
          icon: Shield,
          title: "1. Responsable del Tratamiento",
          content: `
            ${CONTACT_INFO.name}
            ${CONTACT_INFO.address.street}
            ${CONTACT_INFO.address.postalCode} ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.region}
            CIF: ${LEGAL_INFO.cif}
            Email: ${CONTACT_INFO.email}
            Teléfono: ${CONTACT_INFO.phone}
            
            Delegado de Protección de Datos: ${LEGAL_INFO.dataProtectionOfficer}
            Registro RGPD: ${LEGAL_INFO.rgpdRegistry}
          `,
        },
        {
          icon: FileText,
          title: "2. Datos que Recopilamos",
          content: `
            Para gestionar tu reserva en nuestro albergue, recopilamos los siguientes datos:
            
            • Datos de identificación: Nombre, apellidos, DNI/Pasaporte
            • Datos de contacto: Email, teléfono, dirección
            • Datos de reserva: Fechas de estancia, número de camas, preferencias
            • Datos de pago: Información bancaria (procesada por pasarela segura)
            • Datos de navegación: Cookies técnicas y analíticas
            
            Base legal: Ejecución de contrato (art. 6.1.b RGPD) y obligaciones legales del sector turístico.
          `,
        },
        {
          icon: Lock,
          title: "3. Finalidad del Tratamiento",
          content: `
            Tus datos serán utilizados para:
            
            • Gestión de reservas y check-in/check-out
            • Comunicaciones relacionadas con tu estancia
            • Cumplimiento de obligaciones legales (Policía Nacional, Hacienda)
            • Facturación y contabilidad
            • Mejora de nuestros servicios
            • Marketing (solo con tu consentimiento explícito)
          `,
        },
        {
          icon: Eye,
          title: "4. Conservación de Datos",
          content: `
            • Datos de reserva: 6 años (obligación fiscal)
            • Datos de hospedaje: 3 años (Ley de Seguridad Ciudadana)
            • Datos de facturación: 10 años (normativa contable)
            • Consentimientos marketing: hasta revocación
            
            Transcurridos estos plazos, tus datos serán eliminados de forma segura.
          `,
        },
        {
          icon: Mail,
          title: "5. Tus Derechos",
          content: `
            Según el RGPD, tienes derecho a:
            
            • Acceso: Conocer qué datos tenemos sobre ti
            • Rectificación: Corregir datos inexactos
            • Supresión: Solicitar la eliminación de tus datos
            • Oposición: Oponerte al tratamiento
            • Limitación: Solicitar restricción del tratamiento
            • Portabilidad: Recibir tus datos en formato estructurado
            
            Para ejercer estos derechos, contacta: ${LEGAL_INFO.dataProtectionOfficer}
            
            También puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es)
          `,
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: December 20, 2025",
      sections: [
        {
          icon: Shield,
          title: "1. Data Controller",
          content: `
            ${CONTACT_INFO.name}
            ${CONTACT_INFO.address.street}
            ${CONTACT_INFO.address.postalCode} ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.region}
            Tax ID: ${LEGAL_INFO.cif}
            Email: ${CONTACT_INFO.email}
            Phone: ${CONTACT_INFO.phone}
            
            Data Protection Officer: ${LEGAL_INFO.dataProtectionOfficer}
            GDPR Registry: ${LEGAL_INFO.rgpdRegistry}
          `,
        },
        {
          icon: FileText,
          title: "2. Data We Collect",
          content: `
            To manage your booking at our hostel, we collect:
            
            • Identification data: Name, surname, ID/Passport
            • Contact data: Email, phone, address
            • Booking data: Stay dates, bed numbers, preferences
            • Payment data: Banking information (processed via secure gateway)
            • Navigation data: Technical and analytical cookies
            
            Legal basis: Contract execution (art. 6.1.b GDPR) and legal obligations in tourism sector.
          `,
        },
        {
          icon: Lock,
          title: "3. Purpose of Processing",
          content: `
            Your data will be used for:
            
            • Booking management and check-in/check-out
            • Communications related to your stay
            • Compliance with legal obligations (National Police, Tax Authority)
            • Invoicing and accounting
            • Service improvement
            • Marketing (only with explicit consent)
          `,
        },
        {
          icon: Eye,
          title: "4. Data Retention",
          content: `
            • Booking data: 6 years (tax obligation)
            • Lodging data: 3 years (Public Security Law)
            • Invoicing data: 10 years (accounting regulations)
            • Marketing consents: until revocation
            
            After these periods, your data will be securely deleted.
          `,
        },
        {
          icon: Mail,
          title: "5. Your Rights",
          content: `
            Under GDPR, you have the right to:
            
            • Access: Know what data we have about you
            • Rectification: Correct inaccurate data
            • Erasure: Request deletion of your data
            • Objection: Object to processing
            • Restriction: Request processing limitation
            • Portability: Receive your data in structured format
            
            To exercise these rights, contact: ${LEGAL_INFO.dataProtectionOfficer}
            
            You can also file a complaint with the Spanish Data Protection Agency (www.aepd.es)
          `,
        },
      ],
    },
  };

  const data = content[language];

  return (
    <div className="min-h-screen bg-[#FFF9F0] paper-texture overflow-x-hidden">
      {/* Header */}
      <motion.header
        className="bg-[#006b24] py-6 px-4 border-b-4 border-[#00AB39]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
          >
            <img src={logoImage} alt="Logo" className="w-16 h-16" />
            <div>
              <h1 className="text-white sketch-title text-2xl">
                {CONTACT_INFO.name}
              </h1>
              <p className="text-[#E8F5E9] text-sm hand-drawn">
                {language === "es"
                  ? "Camino de Santiago"
                  : "Camino de Santiago"}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-5xl md:text-6xl sketch-title text-[#006b24] mb-4">
            {data.title}
          </h1>
          <p className="text-gray-600 hand-drawn text-lg">{data.lastUpdated}</p>
        </motion.div>

        <div className="space-y-8">
          {data.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <DoodleCard color="#00AB39">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-[#00AB39] rounded-full flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sketch-title text-[#006b24] mb-4">
                      {section.title}
                    </h2>
                    <div className="text-gray-700 whitespace-pre-line text-base leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              </DoodleCard>
            </motion.div>
          ))}
        </div>

        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/")}
          className="mt-12 px-8 py-4 bg-[#00AB39] text-white rounded-2xl border-5 border-[#006b24] sketch-title text-xl"
          whileHover={{ scale: 1.05, y: -3 }}
          style={{ boxShadow: "5px 7px 0px rgba(0, 107, 36, 0.5)" }}
        >
          {language === "es" ? "← Volver al Inicio" : "← Back to Home"}
        </motion.button>
      </div>
    </div>
  );
}
