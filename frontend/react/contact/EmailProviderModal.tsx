import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { MailIcon } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';

interface EmailProviderModalProps {
  email: string;
  subject: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COPY = {
  es: {
    title: 'Enviar email',
    gmail: 'Abrir en Gmail',
    outlook: 'Abrir en Outlook',
    app: 'Aplicación predeterminada',
  },
  en: {
    title: 'Send an email',
    gmail: 'Open in Gmail',
    outlook: 'Open in Outlook',
    app: 'Default mail app',
  },
};

export function EmailProviderModal({
  email,
  subject,
  open,
  onOpenChange,
}: Readonly<EmailProviderModalProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;

  const encodedSubject = encodeURIComponent(subject);
  const providers = [
    {
      id: 'gmail',
      label: t.gmail,
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodedSubject}`,
      icon: <img src="/svg/logos/google.svg" alt="" className="h-6 w-6" />,
    },
    {
      id: 'outlook',
      label: t.outlook,
      href: `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${encodedSubject}`,
      icon: <MailIcon className="h-6 w-6" animate={false} />,
    },
    {
      id: 'default',
      label: t.app,
      href: `mailto:${email}?subject=${encodedSubject}`,
      icon: <MailIcon className="h-6 w-6" animate={false} />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-[#1A1A1A] bg-[#FFFFFF]">
        <DialogHeader>
          <DialogTitle className="font-sketch">{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {providers.map((provider) => (
            <a
              key={provider.id}
              href={provider.href}
              target={provider.id === 'default' ? undefined : '_blank'}
              rel={provider.id === 'default' ? undefined : 'noopener noreferrer'}
              className="flex items-center gap-3 rounded-lg border border-[#5D4E37]/20 bg-white px-3 py-2.5 text-sm font-semibold text-[#5D4E37] hover:border-[#00AB39] hover:bg-[#E8F5E9]"
            >
              {provider.icon}
              {provider.label}
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
