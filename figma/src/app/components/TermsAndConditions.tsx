import { motion } from 'motion/react';
import { FileText, Clock, CreditCard, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useNavigate } from 'react-router-dom';
import { DoodleCard } from './doodle/DoodleCard';
import { CONTACT_INFO, LEGAL_INFO } from '../constants/footerData';
import logoImage from 'figma:asset/6340c39809bbb6dce9c21e3fed2ac80a388b79b7.png';

export function TermsAndConditions() {
  const { language } = useI18n();
  const navigate = useNavigate();

  const content = {
    es: {
      title: 'Términos y Condiciones',
      lastUpdated: 'Última actualización: 20 de Diciembre de 2025',
      sections: [
        {
          icon: FileText,
          title: '1. Información General',
          content: `
            Estos Términos y Condiciones regulan el uso de la plataforma de reservas online y los servicios de alojamiento del ${CONTACT_INFO.name}.
            
            Registro Turístico: ${LEGAL_INFO.touristicRegistry}
            Licencia Turismo Rural: ${LEGAL_INFO.ruralTourismLicense}
            Póliza de Responsabilidad Civil: ${LEGAL_INFO.liabilityInsurance}
            Compañía Aseguradora: ${LEGAL_INFO.insuranceCompany}
            
            Al realizar una reserva, aceptas estos términos en su totalidad.
          `
        },
        {
          icon: Clock,
          title: '2. Reservas y Confirmación',
          content: `
            • Las reservas se confirman al recibir el pago completo o señal del 30%
            • Recibirás un email de confirmación en un plazo máximo de 24 horas
            • La reserva incluye cama en dormitorio compartido, ropa de cama y acceso a servicios comunes
            • Check-in: 14:00 - 22:00 horas
            • Check-out: antes de las 10:00 horas
            • Llegadas fuera de horario deben coordinarse previamente (sin coste adicional)
            
            Conforme al Real Decreto 933/2021 sobre alojamientos turísticos, todas las reservas están sujetas a verificación de identidad.
          `
        },
        {
          icon: CreditCard,
          title: '3. Precios y Pago',
          content: `
            • Tarifa estándar: 10€ por noche y persona
            • Tarifas especiales para grupos (consultar disponibilidad)
            • Los precios incluyen IVA
            • Métodos de pago aceptados: Tarjeta, Transferencia, Efectivo, Bizum
            • Pasarela de pago segura con certificado SSL
            
            Facturación: Conforme a normativa fiscal española, se emitirá factura completa para todas las estancias.
          `
        },
        {
          icon: XCircle,
          title: '4. Cancelaciones y Reembolsos',
          content: `
            Política de cancelación según Ley 7/1998 de Turismo de Extremadura:
            
            • Cancelación gratuita hasta 48 horas antes del check-in
            • Cancelación entre 48-24 horas: reembolso del 50%
            • Cancelación con menos de 24 horas: sin reembolso
            • No-show (no presentarse): sin reembolso
            
            Excepciones por causa de fuerza mayor se valorarán individualmente.
            Los reembolsos se procesarán en un plazo máximo de 14 días hábiles.
          `
        },
        {
          icon: CheckCircle,
          title: '5. Obligaciones del Huésped',
          content: `
            El huésped se compromete a:
            
            • Presentar DNI o Pasaporte válido al realizar el check-in
            • Respetar las normas de convivencia del albergue
            • Hacer uso responsable de las instalaciones
            • No fumar en espacios interiores (Ley 28/2005)
            • Respetar el horario de silencio (23:00 - 07:00)
            • Cumplir con las medidas de seguridad e higiene
            
            El incumplimiento puede resultar en la expulsión sin derecho a reembolso.
          `
        },
        {
          icon: AlertTriangle,
          title: '6. Responsabilidad y Limitaciones',
          content: `
            • El albergue no se responsabiliza de objetos personales no depositados en consigna
            • Póliza de RC cubriente de daños según legislación vigente
            • Limitación de responsabilidad según art. 1902 Código Civil
            • Seguro obligatorio conforme a normativa turística de Extremadura
            
            Reclamaciones: Puedes presentar reclamaciones en:
            - Hoja de reclamaciones disponible en recepción
            - Junta Arbitral de Consumo: ${LEGAL_INFO.arbitrationUrl}
            - Plataforma ODR de la UE: ${LEGAL_INFO.odrPlatform}
          `
        }
      ],
      footer: `
        Estos términos se rigen por la legislación española. Para cualquier disputa, serán competentes los Juzgados y Tribunales de ${CONTACT_INFO.address.region}.
        
        Normativa aplicable:
        • Ley 7/1998 de Turismo de Extremadura
        • Real Decreto 933/2021 sobre alojamientos turísticos
        • Ley General para la Defensa de Consumidores y Usuarios
        • Código Civil español
      `
    },
    en: {
      title: 'Terms and Conditions',
      lastUpdated: 'Last updated: December 20, 2025',
      sections: [
        {
          icon: FileText,
          title: '1. General Information',
          content: `
            These Terms and Conditions govern the use of the online booking platform and accommodation services at ${CONTACT_INFO.name}.
            
            Tourism Registry: ${LEGAL_INFO.touristicRegistry}
            Rural Tourism License: ${LEGAL_INFO.ruralTourismLicense}
            Liability Insurance Policy: ${LEGAL_INFO.liabilityInsurance}
            Insurance Company: ${LEGAL_INFO.insuranceCompany}
            
            By making a reservation, you accept these terms in full.
          `
        },
        {
          icon: Clock,
          title: '2. Bookings and Confirmation',
          content: `
            • Bookings are confirmed upon receipt of full payment or 30% deposit
            • You will receive a confirmation email within 24 hours
            • Booking includes bed in shared dormitory, bed linen, and access to common facilities
            • Check-in: 2:00 PM - 10:00 PM
            • Check-out: before 10:00 AM
            • Late arrivals must be coordinated in advance (no additional cost)
            
            According to Royal Decree 933/2021 on tourist accommodations, all bookings are subject to identity verification.
          `
        },
        {
          icon: CreditCard,
          title: '3. Prices and Payment',
          content: `
            • Standard rate: €10 per night per person
            • Special group rates (check availability)
            • Prices include VAT
            • Accepted payment methods: Card, Transfer, Cash, Bizum
            • Secure payment gateway with SSL certificate
            
            Invoicing: In accordance with Spanish tax regulations, a complete invoice will be issued for all stays.
          `
        },
        {
          icon: XCircle,
          title: '4. Cancellations and Refunds',
          content: `
            Cancellation policy according to Extremadura Tourism Law 7/1998:
            
            • Free cancellation up to 48 hours before check-in
            • Cancellation between 48-24 hours: 50% refund
            • Cancellation less than 24 hours: no refund
            • No-show: no refund
            
            Force majeure exceptions will be evaluated individually.
            Refunds will be processed within a maximum of 14 business days.
          `
        },
        {
          icon: CheckCircle,
          title: '5. Guest Obligations',
          content: `
            The guest agrees to:
            
            • Present valid ID or Passport at check-in
            • Respect hostel coexistence rules
            • Make responsible use of facilities
            • No smoking indoors (Law 28/2005)
            • Respect quiet hours (11:00 PM - 7:00 AM)
            • Comply with safety and hygiene measures
            
            Non-compliance may result in expulsion without refund.
          `
        },
        {
          icon: AlertTriangle,
          title: '6. Liability and Limitations',
          content: `
            • The hostel is not responsible for personal items not deposited in storage
            • Liability insurance covering damages according to current legislation
            • Liability limitation per art. 1902 Civil Code
            • Mandatory insurance according to Extremadura tourism regulations
            
            Claims: You can file claims at:
            - Complaint forms available at reception
            - Consumer Arbitration Board: ${LEGAL_INFO.arbitrationUrl}
            - EU ODR Platform: ${LEGAL_INFO.odrPlatform}
          `
        }
      ],
      footer: `
        These terms are governed by Spanish law. For any dispute, the Courts of ${CONTACT_INFO.address.region} will have jurisdiction.
        
        Applicable regulations:
        • Extremadura Tourism Law 7/1998
        • Royal Decree 933/2021 on tourist accommodations
        • General Law for Consumer Protection
        • Spanish Civil Code
      `
    }
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
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
          >
            <img src={logoImage} alt="Logo" className="w-16 h-16" />
            <div>
              <h1 className="text-white sketch-title text-2xl">{CONTACT_INFO.name}</h1>
              <p className="text-[#E8F5E9] text-sm hand-drawn">
                {language === 'es' ? 'Camino de Santiago' : 'Camino de Santiago'}
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
              <DoodleCard color="#0071BC">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-[#0071BC] rounded-full flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sketch-title text-[#0071BC] mb-4">
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

          {/* Footer Note */}
          <DoodleCard color="#8B6914">
            <div className="bg-[#FFF3E0] p-6 rounded-xl border-3 border-[#8B6914]">
              <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                {data.footer}
              </p>
            </div>
          </DoodleCard>
        </div>

        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="mt-12 px-8 py-4 bg-[#0071BC] text-white rounded-2xl border-5 border-[#004d80] sketch-title text-xl"
          whileHover={{ scale: 1.05, y: -3 }}
          style={{ boxShadow: '5px 7px 0px rgba(0, 77, 128, 0.5)' }}
        >
          {language === 'es' ? '← Volver al Inicio' : '← Back to Home'}
        </motion.button>
      </div>
    </div>
  );
}
