import { useState } from 'react';
import { DoodleFrame } from '../doodle/DoodleFrame';
import { TiltPanel } from './TiltPanel';
import { ChatAgentBlock } from './ChatAgentBlock';
import { EmailProviderModal } from './EmailProviderModal';
import { MapLibreMap } from '../shared/MapLibreMap';
import { FloatingLottie } from '../shared/FloatingLottie';
import { PhoneIcon, MapPinIcon, MailIcon, PaperPlaneIcon } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';
import { CONTACT_INFO } from '../constants/footerData';
import type { HostelAggregate } from '../../src/lib/hostelTypes';

const COPY = {
  es: {
    voiceTitle: 'Voz',
    voiceEmergency: 'Teléfonos de emergencia',
    textTitle: 'Mensaje',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    email: 'Email',
    personTitle: 'En Persona',
    emailSubject: 'Consulta desde la web',
  },
  en: {
    voiceTitle: 'Voice',
    voiceEmergency: 'Emergency phone numbers',
    textTitle: 'Message',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    email: 'Email',
    personTitle: 'In Person',
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
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const phoneDigits = CONTACT_INFO.phone.replace(/[^0-9]/g, '');
  const fullAddress = `${CONTACT_INFO.address.street}, ${CONTACT_INFO.address.postalCode} ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.region}`;

  return (
    <section className="container mx-auto max-w-5xl px-4 py-8">
      <div className="relative grid grid-cols-1 gap-5 md:h-[calc(100dvh-260px)] md:min-h-[520px] md:grid-cols-2 md:grid-rows-2">
        <FloatingLottie clip="wave-hello" side="right" top="15%" size={140} speed={0.7} />

        {/* Voice */}
        <TiltPanel>
          <DoodleFrame className="h-full">
            <div className="flex h-full flex-col p-4">
              <div className="mb-2 flex items-center gap-2">
                <PhoneIcon className="h-8 w-8 shrink-0" />
                <h3 className="text-base font-bold text-[#5D4E37] font-sketch">{t.voiceTitle}</h3>
              </div>
              <a
                href={`tel:${phoneDigits}`}
                className="mb-2 block rounded-lg bg-[#E8F5E9] px-3 py-3 text-center text-lg font-bold text-[#00AB39] hover:bg-[#00AB39] hover:text-white"
              >
                {CONTACT_INFO.phone}
              </a>
              <a
                href="/hostel/services/"
                className="mt-auto text-xs font-semibold text-[#ED1C24] hover:underline"
              >
                {t.voiceEmergency} →
              </a>
            </div>
          </DoodleFrame>
        </TiltPanel>

        {/* Text */}
        <TiltPanel>
          <DoodleFrame className="h-full">
            <div className="flex h-full flex-col justify-center gap-2 p-4">
              <h3 className="mb-1 text-base font-bold text-[#5D4E37] font-sketch">{t.textTitle}</h3>
              <a
                href={`https://wa.me/${phoneDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-[#5D4E37]/15 px-3 py-2 hover:bg-[#E8F5E9]"
              >
                <img src="/svg/logos/whatsapp.svg" alt="" className="h-6 w-6" />
                <span className="text-sm font-semibold text-[#5D4E37]">{t.whatsapp}</span>
              </a>
              <a
                href={`https://t.me/${TELEGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-[#5D4E37]/15 px-3 py-2 hover:bg-[#E8F5E9]"
              >
                <PaperPlaneIcon className="h-6 w-6" animate={false} />
                <span className="text-sm font-semibold text-[#5D4E37]">{t.telegram}</span>
              </a>
              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                className="flex items-center gap-3 rounded-lg border border-[#5D4E37]/15 px-3 py-2 text-left hover:bg-[#E8F5E9]"
              >
                <MailIcon className="h-6 w-6" animate={false} />
                <span className="text-sm font-semibold text-[#5D4E37]">{t.email}</span>
              </button>
            </div>
          </DoodleFrame>
        </TiltPanel>

        {/* In Person */}
        <TiltPanel>
          <DoodleFrame className="h-full">
            <div className="flex h-full flex-col p-4">
              <div className="mb-2 flex items-start gap-2">
                <MapPinIcon className="h-8 w-8 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-[#5D4E37] font-sketch">
                    {t.personTitle}
                  </h3>
                  <p className="text-xs text-[#5D4E37]/70">{fullAddress}</p>
                </div>
              </div>
              <MapLibreMap
                center={[CONTACT_INFO.coordinates.lng, CONTACT_INFO.coordinates.lat]}
                zoom={13}
                markers={[
                  {
                    id: 'albergue',
                    coords: [CONTACT_INFO.coordinates.lng, CONTACT_INFO.coordinates.lat],
                    label: CONTACT_INFO.name,
                  },
                ]}
                className="min-h-[120px] flex-1 rounded-lg"
              />
            </div>
          </DoodleFrame>
        </TiltPanel>

        {/* Agent */}
        <TiltPanel>
          <DoodleFrame variant="featured" className="h-full">
            <div className="h-full p-4">
              <ChatAgentBlock hostelInfo={hostelInfo} />
            </div>
          </DoodleFrame>
        </TiltPanel>
      </div>

      <EmailProviderModal
        email={CONTACT_INFO.email}
        subject={t.emailSubject}
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
      />
    </section>
  );
}
