import { useI18n } from '../hooks/useI18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { MapPinIcon, PhoneIcon, ExternalLinkIcon, StarIcon } from '../doodle/DoodleIcons';
import { resolvePlaceIcon } from './categoryIcons';
import type { PlaceWithDetails } from './types';

const PRICE_LEVEL_SYMBOL = ['€', '€€', '€€€', '€€€€'];

interface PlaceDetailModalProps {
  place: PlaceWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Renders a markdown-ish description as paragraphs, without pulling in a
 * markdown parser -- plain text/line-breaks only, no HTML interpolation. */
function PlainParagraphs({ text }: Readonly<{ text: string }>) {
  return (
    <>
      {text.split(/\n{2,}/).map((para) => (
        <p key={para.slice(0, 40)} className="mb-3 text-sm text-[#5D4E37]/80 font-handwritten">
          {para}
        </p>
      ))}
    </>
  );
}

export function PlaceDetailModal({ place, open, onOpenChange }: Readonly<PlaceDetailModalProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  if (!place) return null;

  const name = isEs ? place.nameEs : place.nameEn;
  const description = isEs ? place.descriptionMarkdownEs : place.descriptionMarkdownEn;
  const shortDescription = isEs ? place.shortDescriptionEs : place.shortDescriptionEn;
  const rating = place.rating ? Number(place.rating) : null;
  const Icon = resolvePlaceIcon(place.category, place.iconName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto p-0">
        {place.images.length > 0 && (
          <div className="flex gap-1 overflow-x-auto">
            {place.images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={(isEs ? image.altTextEs : image.altTextEn) ?? name}
                className="h-48 w-full shrink-0 object-cover first:rounded-t-lg"
                loading="lazy"
              />
            ))}
          </div>
        )}

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-sketch">
              <Icon className="h-6 w-6 shrink-0 text-[#00AB39]" />
              {name}
            </DialogTitle>
          </DialogHeader>

          {rating !== null && (
            <div className="mt-1 flex items-center gap-1 text-sm text-[#5D4E37]/70">
              <StarIcon className="h-4 w-4 text-[#EAC102]" />
              {rating.toFixed(1)}
              {place.ratingCount ? ` (${place.ratingCount})` : ''}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {place.priceLevel && (
              <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#00AB39]">
                {PRICE_LEVEL_SYMBOL[place.priceLevel - 1] ?? '€'}
              </span>
            )}
            {place.labels.map((label) => (
              <span
                key={label.id}
                className="rounded-full bg-[#5D4E37]/10 px-3 py-1 text-xs font-semibold text-[#5D4E37]"
              >
                {isEs ? label.labelEs : label.labelEn}
              </span>
            ))}
          </div>

          <div className="mt-4">
            {description ? (
              <PlainParagraphs text={description} />
            ) : (
              shortDescription && (
                <p className="text-sm text-[#5D4E37]/80 font-handwritten">{shortDescription}</p>
              )
            )}
          </div>

          {place.prices.length > 0 && (
            <dl className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-[#E8F5E9] p-3 text-xs">
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

          <div className="mt-4 space-y-2">
            {place.addresses.map((address) => (
              <p key={address.id} className="flex items-start gap-2 text-sm text-[#5D4E37]/80">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#00AB39]" />
                {address.street}, {address.city}
                {address.postalCode ? ` (${address.postalCode})` : ''}
              </p>
            ))}
            {place.phones.map((phone) => (
              <a
                key={phone.id}
                href={`tel:${phone.phoneNumber}`}
                className="flex items-center gap-2 text-sm text-[#5D4E37]/80 hover:text-[#00AB39]"
              >
                <PhoneIcon className="h-4 w-4 shrink-0 text-[#00AB39]" />
                {phone.phoneNumber}
              </a>
            ))}
          </div>

          {place.websiteUrl && (
            <a
              href={place.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-lg border-2 border-[#00AB39] py-2 text-sm font-semibold text-[#00AB39] hover:bg-[#E8F5E9]"
            >
              {isEs ? 'Visitar sitio web' : 'Visit website'}{' '}
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
