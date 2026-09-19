import { motion } from "motion/react";
import { Cookie, Settings, BarChart3, Shield } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";
import { useNavigate } from "react-router-dom";
import { DoodleCard } from "./doodle/DoodleCard";
import { CONTACT_INFO } from "../constants/footerData";
import logoImage from "figma:asset/6340c39809bbb6dce9c21e3fed2ac80a388b79b7.png";

export function CookiePolicy() {
  const { language } = useI18n();
  const navigate = useNavigate();

  const content = {
    es: {
      title: "Política de Cookies",
      lastUpdated: "Última actualización: 20 de Diciembre de 2025",
      intro:
        "Esta web utiliza cookies para mejorar tu experiencia de navegación. Conforme a la Ley 34/2002 (LSSI) y el RGPD, te informamos sobre las cookies que utilizamos.",
      sections: [
        {
          icon: Cookie,
          title: "¿Qué son las Cookies?",
          content: `
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y preferencias durante un período de tiempo.
            
            Utilizamos cookies propias y de terceros para fines técnicos, analíticos y de personalización.
          `,
        },
        {
          icon: Settings,
          title: "Cookies Técnicas (Necesarias)",
          content: `
            Estas cookies son esenciales para el funcionamiento del sitio:
            
            • Cookie de sesión: Mantiene tu sesión activa
            • Cookie de idioma: Guarda tu preferencia de idioma (ES/EN)
            • Cookie de consentimiento: Recuerda tus preferencias de cookies
            
            Duración: Sesión o 1 año
            No requieren consentimiento según RGPD (estrictamente necesarias)
          `,
        },
        {
          icon: BarChart3,
          title: "Cookies Analíticas",
          content: `
            Utilizamos Google Analytics para entender cómo los usuarios interactúan con nuestro sitio:
            
            • _ga: Identificador único (2 años)
            • _gid: Identificador de sesión (24 horas)
            • _gat: Control de tasa de peticiones (1 minuto)
            
            Estos datos son anónimos y nos ayudan a mejorar la experiencia del usuario.
            Requieren tu consentimiento explícito.
          `,
        },
        {
          icon: Shield,
          title: "Gestión de Cookies",
          content: `
            Puedes controlar y gestionar las cookies de varias formas:
            
            1. Panel de Consentimiento: Al entrar al sitio, puedes aceptar o rechazar
            2. Configuración del Navegador:
               • Chrome: Configuración > Privacidad > Cookies
               • Firefox: Opciones > Privacidad > Cookies
               • Safari: Preferencias > Privacidad
               • Edge: Configuración > Cookies
            
            Rechazar cookies puede afectar la funcionalidad del sitio.
            
            Más info sobre cookies: www.aboutcookies.org
          `,
        },
      ],
    },
    en: {
      title: "Cookie Policy",
      lastUpdated: "Last updated: December 20, 2025",
      intro:
        "This website uses cookies to improve your browsing experience. In accordance with Law 34/2002 (LSSI) and GDPR, we inform you about the cookies we use.",
      sections: [
        {
          icon: Cookie,
          title: "What are Cookies?",
          content: `
            Cookies are small text files stored on your device when you visit a website. They allow the site to remember your actions and preferences over a period of time.
            
            We use our own and third-party cookies for technical, analytical, and personalization purposes.
          `,
        },
        {
          icon: Settings,
          title: "Technical Cookies (Necessary)",
          content: `
            These cookies are essential for the site to function:
            
            • Session cookie: Keeps your session active
            • Language cookie: Saves your language preference (ES/EN)
            • Consent cookie: Remembers your cookie preferences
            
            Duration: Session or 1 year
            Do not require consent under GDPR (strictly necessary)
          `,
        },
        {
          icon: BarChart3,
          title: "Analytical Cookies",
          content: `
            We use Google Analytics to understand how users interact with our site:
            
            • _ga: Unique identifier (2 years)
            • _gid: Session identifier (24 hours)
            • _gat: Request rate control (1 minute)
            
            This data is anonymous and helps us improve user experience.
            Require your explicit consent.
          `,
        },
        {
          icon: Shield,
          title: "Cookie Management",
          content: `
            You can control and manage cookies in several ways:
            
            1. Consent Panel: When entering the site, you can accept or reject
            2. Browser Settings:
               • Chrome: Settings > Privacy > Cookies
               • Firefox: Options > Privacy > Cookies
               • Safari: Preferences > Privacy
               • Edge: Settings > Cookies
            
            Rejecting cookies may affect site functionality.
            
            More info about cookies: www.aboutcookies.org
          `,
        },
      ],
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
              <DoodleCard color="#D4A574">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-[#D4A574] rounded-full flex items-center justify-center flex-shrink-0">
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
        </div>

        <motion.button
          onClick={() => navigate("/")}
          className="mt-12 px-8 py-4 bg-[#D4A574] text-white rounded-2xl border-5 border-[#8B6914] sketch-title text-xl"
          whileHover={{ scale: 1.05, y: -3 }}
          style={{ boxShadow: "5px 7px 0px rgba(139, 105, 20, 0.5)" }}
        >
          {language === "es" ? "← Volver al Inicio" : "← Back to Home"}
        </motion.button>
      </div>
    </div>
  );
}
