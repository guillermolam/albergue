import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon } from '../doodle/DoodleIcons';
import { useI18n } from '../hooks/useI18n';

interface WifiAccessCardProps {
  ssid: string;
  password: string;
}

// These are UI label strings ("Contraseña"/"Password"), not a credential.
// The actual WiFi password is intentionally public, guest-facing
// information (same as a QR code posted on a hostel wall), not a secret
// that belongs in an env var or secret manager.
const COPY = {
  es: {
    network: 'Red',
    password: 'Contraseña', // NOSONAR typescript:S2068
    copy: 'Copiar',
    copied: 'Copiado',
    show: 'Mostrar',
    hide: 'Ocultar',
    qrAlt: 'Código QR de la WiFi',
  },
  en: {
    network: 'Network',
    password: 'Password', // NOSONAR typescript:S2068
    copy: 'Copy',
    copied: 'Copied',
    show: 'Show',
    hide: 'Hide',
    qrAlt: 'WiFi QR code',
  },
};

function CredentialBadge({
  label,
  value,
  masked = false,
  copyLabel,
  copiedLabel,
  showLabel,
  hideLabel,
}: Readonly<{
  label: string;
  value: string;
  masked?: boolean;
  copyLabel: string;
  copiedLabel: string;
  showLabel: string;
  hideLabel: string;
}>) {
  const [revealed, setRevealed] = useState(!masked);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (permissions, insecure context) -- the
      // value is still visible on screen, so this isn't worth surfacing
      // as an error state.
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-[#00AB39]/40 bg-[#E8F5E9] py-1 pl-3 pr-1.5 text-xs">
      <span className="text-[#5D4E37]/70">{label}:</span>
      <span className="min-w-0 truncate font-mono font-semibold text-[#006B26]">
        {masked && !revealed ? '•'.repeat(value.length) : value}
      </span>
      {masked && (
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          aria-label={revealed ? hideLabel : showLabel}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#5D4E37]/70 hover:bg-white"
        >
          {revealed ? (
            <EyeOffIcon className="h-3.5 w-3.5" animate={false} />
          ) : (
            <EyeIcon className="h-3.5 w-3.5" animate={false} />
          )}
        </button>
      )}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : copyLabel}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#5D4E37]/70 hover:bg-white"
      >
        {copied ? (
          <CheckIcon className="h-3.5 w-3.5 text-[#00AB39]" animate={false} />
        ) : (
          <CopyIcon className="h-3.5 w-3.5" animate={false} />
        )}
      </button>
    </div>
  );
}

export function WifiAccessCard({ ssid, password }: Readonly<WifiAccessCardProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const wifiUri = `WIFI:T:WPA;S:${ssid};P:${password};;`;
    QRCode.toDataURL(wifiUri, { width: 160, margin: 1 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [ssid, password]);

  return (
    <div className="mb-3 flex items-center gap-3">
      {qrDataUrl && (
        <img
          src={qrDataUrl}
          alt={t.qrAlt}
          className="h-20 w-20 shrink-0 rounded-lg border border-[#5D4E37]/20 bg-white p-1"
        />
      )}
      <div className="flex flex-1 flex-col gap-1.5">
        <CredentialBadge
          label={t.network}
          value={ssid}
          copyLabel={t.copy}
          copiedLabel={t.copied}
          showLabel={t.show}
          hideLabel={t.hide}
        />
        <CredentialBadge
          label={t.password}
          value={password}
          masked
          copyLabel={t.copy}
          copiedLabel={t.copied}
          showLabel={t.show}
          hideLabel={t.hide}
        />
      </div>
    </div>
  );
}
