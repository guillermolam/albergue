import { useState } from 'react';
import { DoodleFrame } from '../doodle/DoodleFrame';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ShieldIcon, CompassIcon, ExternalLinkIcon } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';
import { QUICK_LINKS } from '../constants/footerData';

const COPY = {
  es: {
    title: 'Instituciones y Organismos Oficiales',
    subtitle: 'Enlaces oficiales del Camino, turismo y protección al consumidor',
    visit: 'Visitar sitio web',
    descriptions: {
      'camino-info': 'Portal oficial de información sobre el Camino de Santiago.',
      'extremadura-tourism': 'Organismo oficial de turismo de la Junta de Extremadura.',
      'consumer-rights':
        'Junta Arbitral de Consumo de Extremadura, para resolver disputas de consumo.',
    } as Record<string, string>,
  },
  en: {
    title: 'Institutions & Government',
    subtitle: 'Official Camino, tourism, and consumer-protection links',
    visit: 'Visit website',
    descriptions: {
      'camino-info': 'Official Camino de Santiago information portal.',
      'extremadura-tourism': "Extremadura regional government's official tourism board.",
      'consumer-rights': 'Extremadura Consumer Arbitration Board, for resolving consumer disputes.',
    } as Record<string, string>,
  },
};

export function InstitutionsSection() {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = QUICK_LINKS.external.find((link) => link.id === activeId) ?? null;

  return (
    <section className="container mx-auto max-w-5xl px-4 py-12">
      <h2 className="mb-1 flex items-center gap-2 text-2xl font-bold text-[#5D4E37] font-sketch">
        <ShieldIcon className="h-7 w-7" />
        {t.title}
      </h2>
      <p className="mb-6 text-sm text-[#5D4E37]/70 font-handwritten">{t.subtitle}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {QUICK_LINKS.external.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => setActiveId(link.id)}
            className="text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AB39]"
          >
            <DoodleFrame className="paper-texture">
              <div className="flex items-start gap-3 p-4">
                <div className="shrink-0 rounded-full bg-[#E8F5E9] p-2 text-[#00AB39]">
                  <CompassIcon className="h-6 w-6" />
                </div>
                <h3 className="pt-1 text-sm font-bold text-[#5D4E37] font-sketch">
                  {isEs ? link.labelES : link.labelEN}
                </h3>
              </div>
            </DoodleFrame>
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActiveId(null)}>
        <DialogContent className="border-2 border-[#1A1A1A] bg-[#FFFFFF]">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="font-sketch">
                  {isEs ? active.labelES : active.labelEN}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-[#5D4E37]/80 font-handwritten">
                {t.descriptions[active.id]}
              </p>
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-lg border-2 border-[#00AB39] py-2 text-sm font-semibold text-[#00AB39] hover:bg-[#E8F5E9]"
              >
                {t.visit} <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
