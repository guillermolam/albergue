import { useState } from 'react';
import { actions } from 'astro:actions';
import { motion } from 'motion/react';
import { PageHero } from './shared/PageHero';
import { WiredButton } from './doodle/WiredButton';
import { useI18n } from './hooks/useI18n';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { ContactHub } from './contact/ContactHub';
import { InstitutionsSection } from './contact/InstitutionsSection';
import { SocialSection } from './contact/SocialSection';
import { LegalIdentitySection } from './contact/LegalIdentitySection';
import { NEO, NEO_INPUT } from './contact/neo';
import type { HostelAggregate } from '../src/lib/hostelTypes';

const COPY = {
  es: {
    eyebrow: 'El Carrascalejo · Badajoz',
    title: 'Contacto',
    subtitle: 'Llámanos, escríbenos o pásate.',
    formHeading: 'O envíanos un mensaje',
    formName: 'Nombre',
    formEmail: 'Email',
    formSubject: 'Asunto (opcional)',
    formMessage: 'Mensaje',
    formSubmit: 'Enviar mensaje',
    formSending: 'Enviando…',
    formSuccess: '¡Recibido! Te respondemos pronto.',
    formError: 'No se pudo enviar. Inténtalo de nuevo.',
  },
  en: {
    eyebrow: 'El Carrascalejo · Badajoz',
    title: 'Contact',
    subtitle: 'Call, write, or stop by.',
    formHeading: 'Or send a message',
    formName: 'Name',
    formEmail: 'Email',
    formSubject: 'Subject (optional)',
    formMessage: 'Message',
    formSubmit: 'Send message',
    formSending: 'Sending…',
    formSuccess: 'Got it! We’ll reply soon.',
    formError: 'Could not send. Please try again.',
  },
} as const;

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

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
  const reduceMotion = usePrefersReducedMotion();

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setErrorMessage('');

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

      <section className="container mx-auto max-w-2xl px-4 py-10">
        <motion.h2
          className="mb-4 text-2xl font-black text-[#1A1A1A] font-sketch"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t.formHeading}
        </motion.h2>
        <motion.form
          method="post"
          data-no-swup
          onSubmit={handleSubmit}
          className={`${NEO} space-y-4 rounded-xl bg-[#FFF8E7] p-5 md:p-6`}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="contact-name" name="name" label={t.formName} required maxLength={120} />
            <Field id="contact-email" name="email" label={t.formEmail} type="email" required />
          </div>
          <Field id="contact-subject" name="subject" label={t.formSubject} maxLength={200} />
          <div>
            <label
              htmlFor="contact-message"
              className="mb-1 block text-sm font-black text-[#1A1A1A]"
            >
              {t.formMessage}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={4000}
              rows={4}
              className={`${NEO_INPUT} resize-y`}
            />
          </div>

          <WiredButton type="submit" disabled={status === 'sending'} className="w-full">
            {status === 'sending' ? t.formSending : t.formSubmit}
          </WiredButton>

          {status === 'success' && (
            <output className="block text-sm font-black text-[#00AB39]">{t.formSuccess}</output>
          )}
          {status === 'error' && (
            <p role="alert" className="text-sm font-black text-[#ED1C24]">
              {errorMessage}
            </p>
          )}
        </motion.form>
      </section>

      <LegalIdentitySection hostelInfo={hostelInfo} />
    </>
  );
}

function Field({
  id,
  name,
  label,
  type = 'text',
  required,
  maxLength,
}: Readonly<{
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-black text-[#1A1A1A]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        className={NEO_INPUT}
      />
    </div>
  );
}
