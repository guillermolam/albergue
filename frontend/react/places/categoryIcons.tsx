import type { ComponentType } from 'react';
import {
  UtensilsIcon,
  CocktailIcon,
  PartyIcon,
  MonumentIcon,
  CompassIcon,
  TreeIcon,
  MapPinIcon,
} from '../doodle/DoodleIcons';
import type { PlaceCategory } from './types';

export interface DoodleIconProps {
  className?: string;
  animate?: boolean;
}

const CATEGORY_ICON_MAP: Record<PlaceCategory, ComponentType<DoodleIconProps>> = {
  restaurant: UtensilsIcon,
  bar: CocktailIcon,
  night_club: PartyIcon,
  museum: MonumentIcon,
  trail: CompassIcon,
  park: TreeIcon,
  excursion: CompassIcon,
  pharmacy: MapPinIcon,
  atm: MapPinIcon,
  medical: MapPinIcon,
  transport: MapPinIcon,
  supermarket: MapPinIcon,
  other: MapPinIcon,
};

const NAMED_ICONS: Record<string, ComponentType<DoodleIconProps>> = {
  utensils: UtensilsIcon,
  cocktail: CocktailIcon,
  party: PartyIcon,
  monument: MonumentIcon,
  compass: CompassIcon,
  tree: TreeIcon,
  'map-pin': MapPinIcon,
};

/** A place's own `iconName` overrides its category default when it names a
 * known icon; otherwise falls back to the category's icon. */
export function resolvePlaceIcon(
  category: PlaceCategory,
  iconName?: string | null
): ComponentType<DoodleIconProps> {
  if (iconName && NAMED_ICONS[iconName]) return NAMED_ICONS[iconName];
  return CATEGORY_ICON_MAP[category] ?? MapPinIcon;
}
