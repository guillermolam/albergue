import { useState } from 'react';
import { actions } from 'astro:actions';
import { motion } from 'motion/react';
import { PageHero } from './shared/PageHero';
import { WiredButton } from './doodle/WiredButton';
import { useI18n } from './hooks/useI18n';
import { ContactHub } from './contact/ContactHub';
import { InstitutionsSection } from './contact/InstitutionsSection';
import { SocialSection } from './contact/SocialSection';
import type { HostelAggregate } from '../src/lib/hostelTypes';

const COPY = {
  es: {
    eyebrow: 'Estamos aquí para ayudarte',
    title: 'Contacto',
    subtitle: 'Elige cómo prefieres hablar con nosotros.',
    formHeading: 'O envíanos un mensaje escrito',
    formName: 'Nombre',
    formEmail: 'Email',
    formSubject: 'Asunto (opcional)',
    formMessage: 'Mensaje',
    formSubmit: 'Enviar Mensaje',
    formSending: 'Enviando...',
    formSuccess: '¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.',
    formError: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
  },
  en: {
    eyebrow: "We're here to help",
    title: 'Contact',
    subtitle: "Choose how you'd rather talk to us.",
    formHeading: 'Or send us a written message',
    formName: 'Name',
    formEmail: 'Email',
    formSubject: 'Subject (optional)',
    formMessage: 'Message',
    formSubmit: 'Send Message',
    formSending: 'Sending...',
    formSuccess: "Thank you! We've received your message and will reply soon.",
    formError: 'Could not send the message. Please try again.',
  },
} as const;

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

/** FormData.get() returns `FormDataEntryValue | null` (string | File | null),
 * so a bare `String(x || '')` would stringify a File as "[object File]" if
 * one were ever present. This form has no file inputs, but narrow properly
 * rather than relying on that. */
function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

interface ContactPageProps {
  hostelInfo?: HostelAggregate | null;
}

export function ContactPage({ hostelInfo = null }: Readonly<ContactPageProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    // React nulls out event.currentTarget once the synthetic event is no
    // longer being dispatched, i.e. after this await -- capture the form
    // element up front rather than re-reading it from the event later.
    const form = event.currentTarget;
    const formData = new FormData(form);
    const { data, error } = await actions.contact.submit({
      name: getStringField(formData, 'name'),
      email: getStringField(formData, 'email'),
      subject: getStringField(formData, 'subject') || undefined,
      message: getStringField(formData, 'message'),
    });

    if (error || !data?.ok) {
      setStatus('error');
      setErrorMessage(error?.message || t.formError);
      return;
    }

    setStatus('success');
    form.reset();
  }

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} decor="hospitality" />

      <ContactHub hostelInfo={hostelInfo} />
      <InstitutionsSection />
      <SocialSection />

      <section className="container mx-auto max-w-2xl px-4 py-12">
        <h2 className="mb-4 text-xl font-bold text-[#5D4E37] font-sketch">{t.formHeading}</h2>
        <motion.form
          method="post"
          data-no-swup
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4 rounded-xl border-2 border-[#5D4E37]/30 bg-[#FFFFFF] p-6 doodle-shadow paper-texture"
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
            <output className="block text-sm font-semibold text-[#00AB39]">{t.formSuccess}</output>
          )}
          {status === 'error' && (
            <p role="alert" className="text-sm font-semibold text-[#ED1C24]">
              {errorMessage}
            </p>
          )}
        </motion.form>
      </section>
    </>
  );
}
