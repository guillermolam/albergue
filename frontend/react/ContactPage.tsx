import { useState } from 'react';
import { actions } from 'astro:actions';
import { motion } from 'motion/react';
import { PageHero } from './shared/PageHero';
import { FancyCard } from './shared/FancyCard';
import { MapLibreMap } from './shared/MapLibreMap';
import { WiredButton } from './doodle/WiredButton';
import { PhoneIcon, MapPinIcon, ChatIcon } from './doodle/DoodleIcons';
import { useI18n } from './hooks/useI18n';
import { CONTACT_INFO } from './constants/footerData';

const COPY = {
  es: {
    eyebrow: 'Estamos aquí para ayudarte',
    title: 'Contacto',
    subtitle: 'Escríbenos y te responderemos lo antes posible.',
    phoneTitle: 'Teléfono',
    emailTitle: 'Email',
    addressTitle: 'Dirección',
    formName: 'Nombre',
    formEmail: 'Email',
    formSubject: 'Asunto (opcional)',
    formMessage: 'Mensaje',
    formSubmit: 'Enviar Mensaje',
    formSending: 'Enviando...',
    formSuccess: '¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.',
    formError: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
    mapLabel: 'Nuestra ubicación',
  },
  en: {
    eyebrow: "We're here to help",
    title: 'Contact',
    subtitle: "Send us a message and we'll get back to you as soon as possible.",
    phoneTitle: 'Phone',
    emailTitle: 'Email',
    addressTitle: 'Address',
    formName: 'Name',
    formEmail: 'Email',
    formSubject: 'Subject (optional)',
    formMessage: 'Message',
    formSubmit: 'Send Message',
    formSending: 'Sending...',
    formSuccess: "Thank you! We've received your message and will reply soon.",
    formError: 'Could not send the message. Please try again.',
    mapLabel: 'Our location',
  },
} as const;

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export function ContactPage() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    const { data, error } = await actions.contact.submit({
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      subject: String(formData.get('subject') || '') || undefined,
      message: String(formData.get('message') || ''),
    });

    if (error || !data?.ok) {
      setStatus('error');
      setErrorMessage(error?.message || t.formError);
      return;
    }

    setStatus('success');
    event.currentTarget.reset();
  }

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-1">
              <FancyCard
                title={t.phoneTitle}
                description={CONTACT_INFO.phone}
                icon={<PhoneIcon className="h-8 w-8" />}
                cta={{
                  label: CONTACT_INFO.phone,
                  href: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`,
                }}
              />
              <FancyCard
                title={t.emailTitle}
                description={CONTACT_INFO.email}
                icon={<ChatIcon className="h-8 w-8" />}
                cta={{ label: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` }}
              />
              <FancyCard
                title={t.addressTitle}
                description={`${CONTACT_INFO.address.street}, ${CONTACT_INFO.address.postalCode} ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.region}`}
                icon={<MapPinIcon className="h-8 w-8" />}
              />
            </div>

            <MapLibreMap
              center={[CONTACT_INFO.coordinates.lng, CONTACT_INFO.coordinates.lat]}
              zoom={13}
              markers={[
                {
                  id: 'albergue',
                  coords: [CONTACT_INFO.coordinates.lng, CONTACT_INFO.coordinates.lat],
                  label: t.mapLabel,
                },
              ]}
            />
          </div>

          <motion.form
            method="post"
            data-no-swup
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 rounded-xl border-2 border-[#5D4E37]/30 bg-[#FFF9F0] p-6 doodle-shadow paper-texture"
          >
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1 block text-sm font-semibold text-[#5D4E37]"
              >
                {t.formName}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={120}
                className="w-full rounded-md border-2 border-[#5D4E37]/30 bg-white px-3 py-2 text-[#5D4E37] focus:border-[#00AB39] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1 block text-sm font-semibold text-[#5D4E37]"
              >
                {t.formEmail}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                className="w-full rounded-md border-2 border-[#5D4E37]/30 bg-white px-3 py-2 text-[#5D4E37] focus:border-[#00AB39] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="mb-1 block text-sm font-semibold text-[#5D4E37]"
              >
                {t.formSubject}
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                maxLength={200}
                className="w-full rounded-md border-2 border-[#5D4E37]/30 bg-white px-3 py-2 text-[#5D4E37] focus:border-[#00AB39] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1 block text-sm font-semibold text-[#5D4E37]"
              >
                {t.formMessage}
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                maxLength={4000}
                rows={5}
                className="w-full rounded-md border-2 border-[#5D4E37]/30 bg-white px-3 py-2 text-[#5D4E37] focus:border-[#00AB39] focus:outline-none"
              />
            </div>

            <WiredButton type="submit" disabled={status === 'sending'} className="w-full">
              {status === 'sending' ? t.formSending : t.formSubmit}
            </WiredButton>

            {status === 'success' && (
              <p role="status" className="text-sm font-semibold text-[#00AB39]">
                {t.formSuccess}
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="text-sm font-semibold text-[#ED1C24]">
                {errorMessage}
              </p>
            )}
          </motion.form>
        </div>
      </section>
    </>
  );
}
