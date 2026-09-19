import { motion } from "motion/react";
import { Scale, Building, FileText, Mail } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";
import { useNavigate } from "react-router-dom";
import { DoodleCard } from "./doodle/DoodleCard";
import { CONTACT_INFO, LEGAL_INFO } from "../constants/footerData";
import logoImage from "figma:asset/6340c39809bbb6dce9c21e3fed2ac80a388b79b7.png";

export function LegalNotice() {
  const { language } = useI18n();
  const navigate = useNavigate();

  const content = {
    es: {
      title: "Aviso Legal",
      lastUpdated: "Última actualización: 20 de Diciembre de 2025",
      intro:
        "En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI), se informa de los siguientes datos:",
      sections: [
        {
          icon: Building,
          title: "Datos del Titular",
          content: `
            Denominación social: ${CONTACT_INFO.name}
            CIF: ${LEGAL_INFO.cif}
            Domicilio social: ${CONTACT_INFO.address.street}, ${CONTACT_INFO.address.postalCode} ${CONTACT_INFO.address.city} (${CONTACT_INFO.address.region})
            Teléfono: ${CONTACT_INFO.phone}
            Email: ${CONTACT_INFO.email}
            
            Registro Turístico: ${LEGAL_INFO.touristicRegistry}
            Licencia Turismo Rural: ${LEGAL_INFO.ruralTourismLicense}
          `,
        },
        {
          icon: FileText,
          title: "Objeto y Ámbito de Aplicación",
          content: `
            Este sitio web tiene como objeto proporcionar información sobre los servicios de alojamiento turístico ofrecidos por el ${CONTACT_INFO.name} y facilitar la realización de reservas online.
            
            El acceso y uso del sitio web implica la aceptación de estas condiciones. Si no está de acuerdo, debe abstenerse de utilizar el sitio.
            
            Ámbito territorial: España y Unión Europea
            Público objetivo: Peregrinos del Camino de Santiago y turistas
          `,
        },
        {
          icon: Scale,
          title: "Propiedad Intelectual e Industrial",
          content: `
            Todos los contenidos del sitio web (textos, imágenes, diseño gráfico, código fuente, logotipos, marcas) son propiedad del ${CONTACT_INFO.name} o de terceros que han autorizado su uso.
            
            Quedan prohibidas:
            • La reproducción, distribución o modificación de contenidos sin autorización
            • El uso comercial de la información del sitio
            • La descompilación o ingeniería inversa
            • El uso de técnicas de scraping o data mining
            
            Protección conforme a:
            • Ley de Propiedad Intelectual (Real Decreto Legislativo 1/1996)
            • Ley de Marcas (Ley 17/2001)
          `,
        },
        {
          icon: Mail,
          title: "Responsabilidad y Garantías",
          content: `
            El ${CONTACT_INFO.name} no garantiza:
            • La disponibilidad continua del sitio web (mantenimiento técnico)
            • La ausencia de errores en los contenidos
            • La actualización permanente de la información
            
            Limitaciones de responsabilidad:
            • Daños derivados del uso indebido del sitio
            • Virus informáticos o elementos dañinos
            • Enlaces a sitios web de terceros
            • Contenidos generados por usuarios
            
            El usuario es responsable del uso que haga del sitio y de mantener la confidencialidad de sus credenciales de acceso.
          `,
        },
      ],
      legislation: `
        Legislación Aplicable y Jurisdicción:
        
        Este aviso legal se rige por la legislación española. Para la resolución de cualquier conflicto derivado del acceso o uso del sitio web, ambas partes se someten expresamente a la jurisdicción de los Juzgados y Tribunales de Cáceres.
        
        Normativa de referencia:
        • Ley 34/2002 (LSSI)
        • Real Decreto Legislativo 1/2007 (Consumidores y Usuarios)
        • Ley Orgánica 3/2018 (Protección de Datos)
        • Ley 7/1998 de Turismo de Extremadura
        • Real Decreto 933/2021 (Alojamientos Turísticos)
      `,
      claims: `
        Hojas de Reclamación:
        
        De conformidad con la normativa de protección al consumidor, el establecimiento dispone de hojas oficiales de reclamación a disposición de los clientes.
        
        Puedes presentar reclamaciones en:
        • Recepción del albergue
        • Junta Arbitral de Consumo de Extremadura: ${LEGAL_INFO.arbitrationUrl}
        • Plataforma ODR de la Comisión Europea: ${LEGAL_INFO.odrPlatform}
        
        Contacto para reclamaciones: ${CONTACT_INFO.email}
      `,
    },
    en: {
      title: "Legal Notice",
      lastUpdated: "Last updated: December 20, 2025",
      intro:
        "In compliance with Law 34/2002, of July 11, on Information Society Services and Electronic Commerce (LSSI), the following information is provided:",
      sections: [
        {
          icon: Building,
          title: "Owner Information",
          content: `
            Company name: ${CONTACT_INFO.name}
            Tax ID: ${LEGAL_INFO.cif}
            Registered address: ${CONTACT_INFO.address.street}, ${CONTACT_INFO.address.postalCode} ${CONTACT_INFO.address.city} (${CONTACT_INFO.address.region})
            Phone: ${CONTACT_INFO.phone}
            Email: ${CONTACT_INFO.email}
            
            Tourism Registry: ${LEGAL_INFO.touristicRegistry}
            Rural Tourism License: ${LEGAL_INFO.ruralTourismLicense}
          `,
        },
        {
          icon: FileText,
          title: "Purpose and Scope",
          content: `
            This website aims to provide information about tourist accommodation services offered by ${CONTACT_INFO.name} and facilitate online bookings.
            
            Access and use of the website implies acceptance of these conditions. If you do not agree, you should refrain from using the site.
            
            Territorial scope: Spain and European Union
            Target audience: Camino de Santiago pilgrims and tourists
          `,
        },
        {
          icon: Scale,
          title: "Intellectual and Industrial Property",
          content: `
            All website contents (texts, images, graphic design, source code, logos, trademarks) are property of ${CONTACT_INFO.name} or third parties who have authorized their use.
            
            Prohibited activities:
            • Reproduction, distribution, or modification of content without authorization
            • Commercial use of site information
            • Decompilation or reverse engineering
            • Use of scraping or data mining techniques
            
            Protection under:
            • Intellectual Property Law (Royal Legislative Decree 1/1996)
            • Trademark Law (Law 17/2001)
          `,
        },
        {
          icon: Mail,
          title: "Liability and Warranties",
          content: `
            ${CONTACT_INFO.name} does not guarantee:
            • Continuous availability of the website (technical maintenance)
            • Absence of errors in content
            • Permanent updating of information
            
            Liability limitations:
            • Damages arising from improper use of the site
            • Computer viruses or harmful elements
            • Links to third-party websites
            • User-generated content
            
            The user is responsible for their use of the site and maintaining confidentiality of access credentials.
          `,
        },
      ],
      legislation: `
        Applicable Law and Jurisdiction:
        
        This legal notice is governed by Spanish law. For the resolution of any conflict arising from access or use of the website, both parties expressly submit to the jurisdiction of the Courts of Cáceres.
        
        Reference regulations:
        • Law 34/2002 (LSSI)
        • Royal Legislative Decree 1/2007 (Consumers and Users)
        • Organic Law 3/2018 (Data Protection)
        • Extremadura Tourism Law 7/1998
        • Royal Decree 933/2021 (Tourist Accommodations)
      `,
      claims: `
        Complaint Forms:
        
        In accordance with consumer protection regulations, the establishment has official complaint forms available to customers.
        
        You can file complaints at:
        • Hostel reception
        • Extremadura Consumer Arbitration Board: ${LEGAL_INFO.arbitrationUrl}
        • EU Commission ODR Platform: ${LEGAL_INFO.odrPlatform}
        
        Contact for complaints: ${CONTACT_INFO.email}
      `,
    },
  };

  const data = content[language];

  return (
    <div className="min-h-screen bg-[#FFF9F0] paper-texture overflow-x-hidden">
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
                Camino de Santiago
              </p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-5xl md:text-6xl sketch-title text-[#006b24] mb-4">
            {data.title}
          </h1>
          <p className="text-gray-600 hand-drawn text-lg mb-6">
            {data.lastUpdated}
          </p>
          <p className="text-gray-700 text-base leading-relaxed">
            {data.intro}
          </p>
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
              <DoodleCard color="#8B6914">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-[#8B6914] rounded-full flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sketch-title text-[#8B6914] mb-4">
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

          {/* Legislation */}
          <DoodleCard color="#0071BC">
            <div className="bg-[#E3F2FD] p-6 rounded-xl border-3 border-[#0071BC]">
              <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                {data.legislation}
              </p>
            </div>
          </DoodleCard>

          {/* Claims */}
          <DoodleCard color="#ED1C24">
            <div className="bg-[#FFE5E5] p-6 rounded-xl border-3 border-[#ED1C24]">
              <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                {data.claims}
              </p>
            </div>
          </DoodleCard>
        </div>

        <motion.button
          onClick={() => navigate("/")}
          className="mt-12 px-8 py-4 bg-[#8B6914] text-white rounded-2xl border-5 border-[#5D4E37] sketch-title text-xl"
          whileHover={{ scale: 1.05, y: -3 }}
          style={{ boxShadow: "5px 7px 0px rgba(93, 78, 55, 0.5)" }}
        >
          {language === "es" ? "← Volver al Inicio" : "← Back to Home"}
        </motion.button>
      </div>
    </div>
  );
}
