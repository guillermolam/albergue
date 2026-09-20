import { FloatingLottie, type FloatingLottieProps } from './FloatingLottie';

/**
 * Full-bleed decoration layer for a main section.
 *
 * Drop one inside any `position: relative` section; it adds no layout of its
 * own. Clips are clipped horizontally (so a wide illustration can never push a
 * scrollbar onto the page) but free vertically, which is what lets them lap
 * over into the section above and below.
 *
 * The parent section must be `relative`, and its real content should sit on
 * `relative z-10` so the decoration stays behind it.
 */

type ClipPlacement = FloatingLottieProps;

/**
 * Which clip belongs to which kind of section. Mapping lives here, not at the
 * call sites, so the vocabulary stays consistent across the site: the greeting
 * clip means hospitality, the tools mean the building itself, the tape measure
 * means distance travelled.
 */
export const SECTION_DECOR = {
  /** Home hero -- greeting on the left, the road ahead on the right. */
  welcome: [
    { clip: 'wave-hello', side: 'left', top: '30%', size: 190, inset: 8, opacity: 0.3 },
    {
      clip: 'tape-measure',
      side: 'right',
      top: '72%',
      size: 170,
      inset: 16,
      opacity: 0.24,
      delay: 3.5,
      rotate: -8,
    },
  ],
  /** Anything about being hosted: restaurant, reviews, contact. */
  hospitality: [
    { clip: 'wave-hello', side: 'right', top: '38%', size: 165, opacity: 0.26, delay: 1.2 },
  ],
  /** The building and its kit: facilities. */
  works: [
    { clip: 'pipe-wrench', side: 'left', top: '26%', size: 155, opacity: 0.26, rotate: 10 },
    {
      clip: 'handsaw',
      side: 'right',
      top: '70%',
      size: 175,
      opacity: 0.22,
      delay: 2.8,
      rotate: -6,
    },
  ],
  /** House rules, upkeep, what we can fix for you: services. */
  maintenance: [
    { clip: 'pipe-wrench', side: 'right', top: '34%', size: 160, opacity: 0.25, delay: 0.8 },
  ],
  /** Getting here, stages, kilometres. */
  distance: [
    { clip: 'tape-measure', side: 'left', top: '40%', size: 175, opacity: 0.26, rotate: 6 },
  ],
  /** Out in the area: what to do, eat, visit. */
  journey: [
    { clip: 'tape-measure', side: 'left', top: '24%', size: 150, opacity: 0.22, rotate: -5 },
    {
      clip: 'wave-hello',
      side: 'right',
      top: '74%',
      size: 165,
      opacity: 0.24,
      delay: 2.2,
      flip: true,
    },
  ],
  /** Booking flow -- one clip only, it must not compete with the form. */
  booking: [{ clip: 'handsaw', side: 'right', top: '30%', size: 150, opacity: 0.18, delay: 1.5 }],
} as const satisfies Record<string, readonly ClipPlacement[]>;

export type SectionDecorPreset = keyof typeof SECTION_DECOR;

interface SectionDecorProps {
  preset: SectionDecorPreset;
  /** Extra seconds added to every clip's drift delay in this section. */
  delayOffset?: number;
}

export function SectionDecor({ preset, delayOffset = 0 }: Readonly<SectionDecorProps>) {
  // Widened deliberately: the registry is `as const`, so each entry's own
  // literal type omits the keys it didn't set (`delay`, `rotate`, ...).
  const placements: readonly ClipPlacement[] = SECTION_DECOR[preset];

  return (
    // Spans the viewport, not the (usually narrow, centred) container it sits
    // in, so the clips hang in the page gutters rather than over the content.
    // `zIndex: -1` keeps them under the section's own text without every call
    // site having to lift its content onto a z-layer -- which is why the host
    // section needs `isolate`, to stop -1 slipping behind an ancestor's
    // background. `overflow-x: clip` (not `hidden`) stops a wide clip pushing
    // the page sideways while still letting it spill top and bottom.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-screen -translate-x-1/2 md:block"
      style={{ zIndex: -1, overflowX: 'clip', overflowY: 'visible' }}
    >
      {placements.map((placement, index) => (
        <FloatingLottie
          key={`${placement.clip}-${placement.side ?? 'left'}-${index}`}
          {...placement}
          delay={(placement.delay ?? 0) + delayOffset}
        />
      ))}
    </div>
  );
}
