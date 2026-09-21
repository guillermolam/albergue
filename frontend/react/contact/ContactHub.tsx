import { useState } from 'react';
import { motion } from 'motion/react';
import { ChatAgentBlock } from './ChatAgentBlock';
import { EmailProviderModal } from './EmailProviderModal';
import { MapLibreMap } from '../shared/MapLibreMap';
import { PhoneIcon, MapPinIcon, MailIcon, PaperPlaneIcon } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { CONTACT_INFO } from '../constants/footerData';
import { NEO, NEO_INTERACTIVE } from './neo';
import type { HostelAggregate } from '../../src/lib/hostelTypes';

const COPY = {
  es: {
    voiceTitle: 'Voz',
    voiceEmergency: 'Emergencias →',
    textTitle: 'Mensaje',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    email: 'Email',
    personTitle: 'En persona',
    emailSubject: 'Consulta desde la web',
  },
  en: {
    voiceTitle: 'Voice',
    voiceEmergency: 'Emergencies →',
    textTitle: 'Message',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    email: 'Email',
    personTitle: 'In person',
    emailSubject: 'Inquiry from the website',
  },
};

const TELEGRAM_HANDLE = 'alberguecarrascalejo';

interface ContactHubProps {
  hostelInfo?: HostelAggregate | null;
}

export function ContactHub({ hostelInfo = null }: Readonly<ContactHubProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const reduceMotion = usePrefersReducedMotion();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const phone = hostelInfo?.phone || CONTACT_INFO.phone;
  const email = hostelInfo?.email || CONTACT_INFO.email;
  const street = hostelInfo?.addressStreet || CONTACT_INFO.address.street;
  const postal = hostelInfo?.addressPostalCode || CONTACT_INFO.address.postalCode;
  const city = hostelInfo?.addressCity || CONTACT_INFO.address.city;
  const region = hostelInfo?.addressRegion || CONTACT_INFO.address.region;
  const lat = Number(hostelInfo?.latitude ?? CONTACT_INFO.coordinates.lat);
  const lng = Number(hostelInfo?.longitude ?? CONTACT_INFO.coordinates.lng);
  const phoneDigits = phone.replace(/[^0-9]/g, '');
  const fullAddress = `${street}, ${postal} ${city}, ${region}`;

  const panel = (i: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-40px' as const },
          transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2 md:min-h-[480px]">
        {/* Voice */}
        <motion.div className={`${NEO} flex flex-col rounded-xl bg-[#E8F5E9] p-4`} {...panel(0)}>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#1A1A1A] bg-white">
              <PhoneIcon className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-bold text-[#1A1A1A] font-sketch">{t.voiceTitle}</h3>
          </div>
          <a
            href={`tel:${phoneDigits}`}
            className={`${NEO_INTERACTIVE} mb-3 block rounded-xl bg-[#00AB39] px-4 py-4 text-center text-xl font-black text-white`}
          >
            {phone}
          </a>
          <a
            href="/hostel/services/"
            className="mt-auto text-sm font-black uppercase tracking-wide text-[#ED1C24] hover:underline"
          >
            {t.voiceEmergency}
          </a>
        </motion.div>

        {/* Text */}
        <motion.div
          className={`${NEO} flex flex-col justify-center gap-2 rounded-xl bg-white p-4`}
          {...panel(1)}
        >
          <h3 className="mb-1 text-lg font-bold text-[#1A1A1A] font-sketch">{t.textTitle}</h3>
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${NEO_INTERACTIVE} flex items-center gap-3 rounded-xl bg-[#25D366]/15 px-3 py-3`}
          >
            <img src="/svg/logos/whatsapp.svg" alt="" className="h-6 w-6" />
            <span className="text-sm font-black text-[#1A1A1A]">{t.whatsapp}</span>
          </a>
          <a
            href={`https://t.me/${TELEGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${NEO_INTERACTIVE} flex items-center gap-3 rounded-xl bg-[#E8F5E9] px-3 py-3`}
          >
            <PaperPlaneIcon className="h-6 w-6" animate={false} />
            <span className="text-sm font-black text-[#1A1A1A]">{t.telegram}</span>
          </a>
          <button
            type="button"
            onClick={() => setEmailModalOpen(true)}
            className={`${NEO_INTERACTIVE} flex items-center gap-3 rounded-xl bg-[#FFF8E7] px-3 py-3 text-left`}
          >
            <MailIcon className="h-6 w-6" animate={false} />
            <span className="truncate text-sm font-black text-[#1A1A1A]">{email}</span>
          </button>
        </motion.div>

        {/* In person + map */}
        <motion.div
          className={`${NEO} flex flex-col overflow-hidden rounded-xl bg-white`}
          {...panel(2)}
        >
          <div className="flex items-start gap-2 border-b-2 border-[#1A1A1A] bg-[#FFF8E7] px-4 py-3">
            <MapPinIcon className="mt-0.5 h-6 w-6 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-[#1A1A1A] font-sketch">{t.personTitle}</h3>
              <p className="text-xs font-semibold text-[#1A1A1A]/70">{fullAddress}</p>
            </div>
          </div>
          <MapLibreMap
            center={[lng, lat]}
            zoom={15}
            markers={[
              {
                id: 'albergue',
                coords: [lng, lat],
                label: CONTACT_INFO.name,
              },
            ]}
            className="min-h-[160px] flex-1"
          />
        </motion.div>

        {/* Agent */}
        <motion.div className={`${NEO} rounded-xl bg-[#00AB39] p-4`} {...panel(3)}>
          <div className="h-full rounded-lg border-2 border-[#1A1A1A] bg-white p-3">
            <ChatAgentBlock hostelInfo={hostelInfo} />
          </div>
        </motion.div>
      </div>

      <EmailProviderModal
        email={email}
        subject={t.emailSubject}
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
      />
    </section>
  );
}
