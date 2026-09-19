import { motion } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import { MapPinIcon, PhoneIcon } from '../doodle/DoodleIcons';
import { resolvePlaceIcon } from './categoryIcons';
import type { PlaceWithDetails } from './types';

interface PlaceCardProps {
  place: PlaceWithDetails;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const PRICE_LEVEL_SYMBOL = ['€', '€€', '€€€', '€€€€'];

/** Read-only 5-mask star rating -- daisyUI's rating component built from
 * plain divs (no radio inputs) per its docs' read-only pattern. */
function StaticRating({ rating }: Readonly<{ rating: number }>) {
  const rounded = Math.round(rating);
  return (
    <div className="daisy-rating daisy-rating-sm" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className="daisy-mask daisy-mask-star bg-[#00AB39]"
          aria-current={n === rounded ? 'true' : undefined}
        />
      ))}
    </div>
  );
}

export function PlaceCard({ place, isActive, onClick, className = '' }: Readonly<PlaceCardProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';

  const name = isEs ? place.nameEs : place.nameEn;
  const shortDescription = isEs ? place.shortDescriptionEs : place.shortDescriptionEn;
  const Icon = resolvePlaceIcon(place.category, place.iconName);
  const rating = place.rating ? Number(place.rating) : null;
  const primaryPhone = place.phones.find((p) => p.isPrimary) ?? place.phones[0];
  const primaryAddress = place.addresses.find((a) => a.isPrimary) ?? place.addresses[0];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`daisy-card daisy-card-border bg-base-100 doodle-shadow paper-texture ${
        isActive ? 'border-primary' : 'border-[#5D4E37]/30'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {place.images.length > 0 && (
        <div className="daisy-carousel w-full">
          {place.images.map((image) => (
            <div key={image.id} className="daisy-carousel-item h-40 w-full">
              <img
                src={image.url}
                alt={(isEs ? image.altTextEs : image.altTextEn) ?? name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      <div className="daisy-card-body">
        <div className="flex items-start gap-3">
          {place.avatarUrl ? (
            <div className="daisy-avatar shrink-0">
              <div className="w-10 rounded-full">
                <img src={place.avatarUrl} alt={name} />
              </div>
            </div>
          ) : (
            <Icon className="h-8 w-8 shrink-0 text-primary" />
          )}
          <h3 className="daisy-card-title font-sketch text-[#5D4E37]">{name}</h3>
        </div>

        {shortDescription && (
          <p className="text-sm text-[#5D4E37]/80 font-handwritten">{shortDescription}</p>
        )}

        {rating !== null && <StaticRating rating={rating} />}

        {primaryAddress && (
          <p className="flex items-center gap-1.5 text-xs text-[#5D4E37]/70">
            <MapPinIcon className="h-4 w-4 shrink-0" animate={false} />
            {primaryAddress.street}, {primaryAddress.city}
          </p>
        )}

        {primaryPhone && (
          <p className="flex items-center gap-1.5 text-xs text-[#5D4E37]/70">
            <PhoneIcon className="h-4 w-4 shrink-0" animate={false} />
            {primaryPhone.phoneNumber}
          </p>
        )}

        {(place.labels.length > 0 || place.priceLevel) && (
          <div className="daisy-card-actions flex-wrap">
            {place.priceLevel && (
              <span className="daisy-badge daisy-badge-outline daisy-badge-accent">
                {PRICE_LEVEL_SYMBOL[place.priceLevel - 1] ?? '€'}
              </span>
            )}
            {place.labels.map((label) => (
              <span key={label.id} className="daisy-badge daisy-badge-soft daisy-badge-primary">
                {isEs ? label.labelEs : label.labelEn}
              </span>
            ))}
          </div>
        )}

        {place.prices.length > 0 && (
          <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {place.prices.map((price) => (
              <div key={price.id}>
                <dt className="text-[#5D4E37]/60">{isEs ? price.labelEs : price.labelEn}</dt>
                <dd className="font-semibold text-[#5D4E37]">
                  {price.amount} {price.currency}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </motion.div>
  );
}
