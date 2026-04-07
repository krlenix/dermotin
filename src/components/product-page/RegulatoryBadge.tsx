'use client';

import Image from 'next/image';
import { Product } from '@/config/products';

interface RegulatoryBadgeProps {
  product: Product;
  locale: string;
}

const kapiRegistrations: Record<string, { number: string; date: string }> = {
  biomelis_kapi: { number: '26731/2025', date: '25.03.2025.' },
  bioroid_kapi: { number: '26517/2025', date: '25.03.2025.' },
  immunis_kapi: { number: '26511/2025', date: '25.03.2025.' },
};

const cosmeticRegistrations: Record<string, { number: string; date: string }> = {
  fungel: { number: 'ID-57155/2025', date: '25.06.2025.' },
  biomelis: { number: 'ID-57155/2025', date: '25.06.2025.' },
  biowart: { number: 'ID-57155/2025', date: '25.06.2025.' },
  bioroid: { number: 'ID-57155/2025', date: '25.06.2025.' },
  fungomax: { number: 'ID-57155/2025', date: '25.06.2025.' },
};

const sealTicks = Array.from({ length: 48 }, (_, i) => {
  const angle = (i * 7.5) * (Math.PI / 180);
  const x1 = (65 + 55.5 * Math.cos(angle)).toFixed(3);
  const y1 = (65 + 55.5 * Math.sin(angle)).toFixed(3);
  const x2 = (65 + 58 * Math.cos(angle)).toFixed(3);
  const y2 = (65 + 58 * Math.sin(angle)).toFixed(3);

  return { x1, y1, x2, y2 };
});

function CertificateShell({
  accentColor,
  children,
}: {
  accentColor: 'green' | 'blue';
  children: React.ReactNode;
}) {
  const borderColor = accentColor === 'green' ? '#166534' : '#1e40af';
  const innerBorder = accentColor === 'green' ? '#16653430' : '#1e40af30';
  const patternColor = accentColor === 'green' ? 'rgba(22,101,52,0.03)' : 'rgba(30,64,175,0.03)';

  return (
    <div
      className="relative overflow-visible"
      style={{
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        background: '#fff',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-[6px]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, ${patternColor} 0px, ${patternColor} 1px, transparent 1px, transparent 6px),
            repeating-linear-gradient(90deg, ${patternColor} 0px, ${patternColor} 1px, transparent 1px, transparent 6px)
          `,
        }}
      />

      <div
        className="absolute inset-[6px] pointer-events-none"
        style={{
          border: `1px solid ${innerBorder}`,
          borderRadius: '4px',
        }}
      />

      <div className="relative px-5 py-5 md:px-6 md:py-6">
        {children}
      </div>
    </div>
  );
}

function SealStamp({ color, regNumber, date }: { color: 'green' | 'blue'; regNumber: string; date: string }) {
  const ringColor = color === 'green' ? '#166534' : '#1e40af';
  const textColor = color === 'green' ? '#166534' : '#1e40af';
  const tintLight = color === 'green' ? 'rgba(22,101,52,0.015)' : 'rgba(30,64,175,0.015)';

  return (
    <div
      className="absolute -right-[16px] -top-[38px] z-10 pointer-events-none md:-right-[32px] md:-top-[42px]"
      style={{ width: 130, height: 130 }}
    >
      <svg viewBox="0 0 130 130" className="h-full w-full" style={{ transform: 'rotate(12deg)' }}>
        <defs>
          <clipPath id={`seal-clip-${color}`}>
            <circle cx="65" cy="65" r="57" />
          </clipPath>
          <filter id={`seal-noise-${color}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feComponentTransfer in="gray" result="faded">
              <feFuncA type="linear" slope="0.08" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="faded" mode="multiply" />
          </filter>
        </defs>

        <g clipPath={`url(#seal-clip-${color})`}>
          <circle cx="65" cy="65" r="57" fill="white" />
          <circle cx="65" cy="65" r="57" fill={tintLight} filter={`url(#seal-noise-${color})`} />
        </g>

        <circle cx="65" cy="65" r="58" fill="none" stroke={ringColor} strokeWidth="2.5" opacity="0.8" />
        <circle cx="65" cy="65" r="53" fill="none" stroke={ringColor} strokeWidth="0.75" opacity="0.35" strokeDasharray="3 2" />
        <circle cx="65" cy="65" r="48" fill="none" stroke={ringColor} strokeWidth="0.5" opacity="0.2" />
        {sealTicks.map(({ x1, y1, x2, y2 }, i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ringColor} strokeWidth="1.2" opacity="0.45" />
        ))}

        <path
          id="seal-top-arc"
          d="M 20,65 a 45,45 0 0,1 90,0"
          fill="none"
        />
        <text fontSize="8" fontWeight="800" letterSpacing="0.14em" fill={textColor} opacity="0.7">
          <textPath href="#seal-top-arc" startOffset="50%" textAnchor="middle">
            ★ VERIFIED ★
          </textPath>
        </text>

        <text x="65" y="66" textAnchor="middle" fontSize="11.5" fontWeight="900" fill={textColor} fontFamily="monospace">
          {regNumber}
        </text>
        <text x="65" y="79" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={textColor} opacity="0.6" fontFamily="monospace">
          {date}
        </text>

        <path
          id="seal-bottom-arc"
          d="M 20,65 a 45,45 0 0,0 90,0"
          fill="none"
        />
        <text fontSize="7.5" fontWeight="700" letterSpacing="0.12em" fill={textColor} opacity="0.6">
          <textPath href="#seal-bottom-arc" startOffset="50%" textAnchor="middle">
            CERTIFIED
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export function RegulatoryBadge({ product, locale }: RegulatoryBadgeProps) {
  const isKapi = product.category === 'supplements';
  const isSerbian = locale === 'rs';

  if (isKapi) {
    const reg = kapiRegistrations[product.id];
    if (!reg) return null;

    return (
      <CertificateShell accentColor="green">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
          <Image
            src="/images/regulatory/serbian-coat-of-arms.png"
            alt="Grb Republike Srbije"
            width={56}
            height={75}
            className="h-[60px] w-auto shrink-0 object-contain sm:h-[75px]"
          />

          <div className="w-full min-w-0 sm:flex-1">
            <div className="sm:mr-[100px]">
              <p className="text-[13px] font-extrabold uppercase leading-snug tracking-[0.03em] text-emerald-950 sm:text-[15px] md:text-base">
                Registrovano kod Ministarstva zdravlja Republike Srbije
              </p>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Broj i datum upisa u bazu podataka:
            </p>

            <div className="mt-3 h-px bg-gradient-to-r from-emerald-900/20 via-emerald-900/10 to-transparent sm:bg-gradient-to-r" />

            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Broj upisa</p>
                <p className="mt-1 font-mono text-sm font-black tracking-wider text-emerald-900 sm:text-base">{reg.number}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Datum upisa</p>
                <p className="mt-1 font-mono text-sm font-bold text-emerald-900/70 sm:text-base">{reg.date}</p>
              </div>
            </div>
          </div>
        </div>

        <SealStamp color="green" regNumber={reg.number} date={reg.date} />
      </CertificateShell>
    );
  }

  const reg = cosmeticRegistrations[product.id];
  if (!reg) return null;

  const title = isSerbian
    ? 'Proizveden u Srbiji, usklađen sa EU standardima'
    : 'Usklađen sa EU standardima';
  const subtitleLine1 = isSerbian ? 'Republika Srbija' : 'European Union';
  const subtitleLine2 = isSerbian ? 'Evropska unija' : 'Cosmetics Regulation';
  const desc = isSerbian
    ? 'Kvalitet formulacije potvrđen mikrobiološkim analizama u ovlašćenoj laboratoriji u skladu sa važećim EU propisima za kozmetiku.'
    : 'Kvalitet formulacije potvrđen mikrobiološkim analizama u ovlašćenoj laboratoriji u skladu sa važećim EU propisima za kozmetiku.';

  return (
    <CertificateShell accentColor="blue">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
        {isSerbian ? (
          <Image
            src="/images/regulatory/serbian-coat-of-arms.png"
            alt="Grb Republike Srbije"
            width={56}
            height={75}
            className="h-[60px] w-auto shrink-0 object-contain sm:h-[75px]"
          />
        ) : (
          <Image
            src="/images/regulatory/eu-flag.png"
            alt="EU Flag"
            width={65}
            height={65}
            className="h-[55px] w-[55px] shrink-0 object-contain sm:h-[65px] sm:w-[65px]"
          />
        )}

        <div className="w-full min-w-0 sm:flex-1">
          <div className="sm:mr-[100px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-900/50">
              {subtitleLine1} <span className="text-blue-900/30">•</span> {subtitleLine2}
            </p>
            <p className="mt-2 text-[13px] font-extrabold uppercase leading-snug tracking-[0.03em] text-blue-950 sm:text-[15px] md:text-base">
              {title}
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {desc}
          </p>

          <div className="mt-4 h-px bg-gradient-to-r from-blue-900/20 via-blue-900/10 to-transparent" />

          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">ID Broj</p>
              <p className="mt-1 font-mono text-sm font-black tracking-wider text-blue-900 sm:text-base">{reg.number}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Datum</p>
              <p className="mt-1 font-mono text-sm font-bold text-blue-900/70 sm:text-base">{reg.date}</p>
            </div>
          </div>
        </div>
      </div>

      <SealStamp color="blue" regNumber={reg.number} date={reg.date} />
    </CertificateShell>
  );
}
