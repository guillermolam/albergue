import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { WiredButton } from '../doodle/WiredButton';
import { DoodleFrame } from '../doodle/DoodleFrame';

export interface FancyCardMeta {
  label: string;
  value: string;
}

export interface FancyCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  image?: string;
  meta?: FancyCardMeta[];
  tags?: string[];
  cta?: { label: string; href: string };
  variant?: 'default' | 'featured';
  onClick?: () => void;
  className?: string;
}

/** Doodle-styled rich card, reused across every new Hostel/Area/Contact page.
 * GSAP drives page-level scroll-scrubbed stagger of a list of these (see
 * each page's own ScrollTrigger setup); this component's own motion/react
 * usage stays scoped to hover/tap so the two animation libraries never fight
 * over the same transform. */
export function FancyCard({
  title,
  description,
  icon,
  image,
  meta,
  tags,
  cta,
  variant = 'default',
  onClick,
  className = '',
}: Readonly<FancyCardProps>) {
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      whileHover={{ y: -4, rotate: -0.5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`fancy-card ${onClick ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AB39]' : ''} ${className}`}
    >
      <DoodleFrame variant={isFeatured ? 'featured' : 'default'} className="paper-texture">
        {image && (
          <div className="h-40 w-full overflow-hidden">
            <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
          </div>
        )}

        <div className="p-4">
          <div className="mb-2 flex items-start gap-3">
            {icon && (
              <div className="shrink-0 rounded-full bg-[#E8F5E9] p-2 text-[#00AB39]">{icon}</div>
            )}
            <h3 className="pt-1 text-lg font-bold text-[#5D4E37] font-sketch">{title}</h3>
          </div>

          <p className="mb-3 text-xs text-[#5D4E37]/70 font-handwritten">{description}</p>

          {meta && meta.length > 0 && (
            <dl className="mb-3 grid grid-cols-2 gap-2 text-xs">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-[#5D4E37]/60">{item.label}</dt>
                  <dd className="font-semibold text-[#00AB39]">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {tags && tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#00AB39]/40 bg-[#E8F5E9] px-2 py-0.5 text-xs text-[#00AB39]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {cta && (
            <WiredButton href={cta.href} variant="outline" size="sm">
              {cta.label}
            </WiredButton>
          )}
        </div>
      </DoodleFrame>
    </motion.div>
  );
}
