import { motion } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { LEGAL_INFO, CONTACT_INFO } from '../constants/footerData';
import { NEO } from './neo';
import type { HostelAggregate } from '../../src/lib/hostelTypes';

const COPY = {
  es: {
    eyebrow: 'Identidad legal',
    title: 'Datos del albergue',
    subtitle:
      'Identificación, catastro y registros. Valor catastral y titularidad nominativa son datos protegidos (Sede Catastro / Cl@ve).',
    units: 'Unidades constructivas',
    source: 'Fuente OVC abierta',
  },
  en: {
    eyebrow: 'Legal identity',
    title: 'Hostel particulars',
    subtitle:
      'ID, cadastre and registries. Cadastral value and named ownership are protected (Catastre e-office / Cl@ve).',
    units: 'Built units',
    source: 'Open OVC source',
  },
} as const;

interface LegalIdentitySectionProps {
  hostelInfo?: HostelAggregate | null;
}

export function LegalIdentitySection({ hostelInfo = null }: Readonly<LegalIdentitySectionProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const reduceMotion = usePrefersReducedMotion();
  const cad = LEGAL_INFO.cadastre;

  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: isEs ? 'Denominación' : 'Name', value: hostelInfo?.nameEs || CONTACT_INFO.name },
    {
      label: isEs ? 'Propietario / titular operativo' : 'Owner / operating titular',
      value: LEGAL_INFO.owner,
    },
    { label: 'CIF / NIF', value: hostelInfo?.cif || LEGAL_INFO.cif, mono: true },
    {
      label: isEs ? 'Registro turístico' : 'Tourism registry',
      value: hostelInfo?.touristicRegistry || LEGAL_INFO.touristicRegistry,
      mono: true,
    },
    {
      label: isEs ? 'Licencia turismo rural' : 'Rural tourism license',
      value: hostelInfo?.ruralTourismLicense || LEGAL_INFO.ruralTourismLicense,
      mono: true,
    },
    {
      label: isEs ? 'Referencia catastral' : 'Cadastral reference',
      value: cad.reference,
      mono: true,
    },
    { label: isEs ? 'Dirección catastral' : 'Cadastral address', value: cad.address },
    { label: isEs ? 'Uso catastral' : 'Cadastral use', value: isEs ? cad.useEs : cad.useEn },
    {
      label: isEs ? 'Superficie construida' : 'Built area',
      value: `${cad.builtAreaM2} m²`,
      mono: true,
    },
    {
      label: isEs ? 'Año de construcción' : 'Year built',
      value: String(cad.yearBuilt),
      mono: true,
    },
    {
      label: isEs ? 'Coef. participación' : 'Participation share',
      value: cad.participation,
      mono: true,
    },
    {
      label: isEs ? 'Valor catastral' : 'Cadastral value',
      value: isEs ? 'Protegido — Sede Catastro + Cl@ve' : 'Protected — Catastre e-office + Cl@ve',
    },
    {
      label: isEs ? 'Nº registro de la propiedad' : 'Land registry number',
      value: LEGAL_INFO.propertyRegistryNote,
    },
    {
      label: isEs ? 'Código INE municipio' : 'Municipality INE code',
      value: LEGAL_INFO.ineMunicipalityCode,
      mono: true,
    },
    {
      label: isEs ? 'Registro RGPD' : 'GDPR registry',
      value: hostelInfo?.rgpdRegistry || LEGAL_INFO.rgpdRegistry,
      mono: true,
    },
    {
      label: 'DPO',
      value: hostelInfo?.dataProtectionOfficer || LEGAL_INFO.dataProtectionOfficer,
    },
  ];

  return (
    <section className="bg-[#1A1A1A] py-12 md:py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.header
          className="mb-8 max-w-2xl"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#00AB39]">{t.eyebrow}</p>
          <h2 className="mt-1 text-3xl font-black text-white font-sketch">{t.title}</h2>
          <p className="mt-2 text-sm font-semibold text-white/60">{t.subtitle}</p>
        </motion.header>

        <dl className="grid gap-3 sm:grid-cols-2">
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              className={`${NEO} rounded-xl bg-[#EAC102] px-4 py-3 text-[#1A1A1A] even:bg-[#00AB39] even:text-white`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-16px' }}
              transition={{ delay: Math.min(i * 0.025, 0.3), duration: 0.3 }}
            >
              <dt className="text-[10px] font-black uppercase tracking-wide opacity-70">
                {row.label}
              </dt>
              <dd
                className={`mt-1 text-sm font-bold ${row.mono ? 'font-mono text-[12px] tracking-tight' : 'font-sketch'}`}
              >
                {row.value}
              </dd>
            </motion.div>
          ))}
        </dl>

        <motion.div
          className={`${NEO} mt-6 rounded-xl bg-white p-4 text-[#1A1A1A]`}
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-[#00AB39]">
            {t.units}
          </p>
          <ul className="flex flex-wrap gap-2">
            {cad.units.map((unit) => (
              <li
                key={`${unit.useEs}-${unit.areaM2}`}
                className="rounded-md border-2 border-[#1A1A1A] bg-[#E8F5E9] px-3 py-1 text-xs font-black shadow-[2px_2px_0_0_#1A1A1A]"
              >
                {isEs ? unit.useEs : unit.useEn}: {unit.areaM2} m²
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] font-semibold text-[#1A1A1A]/55">
            {t.source} · RC {cad.referenceShort} ·{' '}
            <a
              href={cad.ovcUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-[#00AB39] underline underline-offset-2"
            >
              sedecatastro.gob.es
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
