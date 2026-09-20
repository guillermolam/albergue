// Islands barrel export — re-export every island component so pages can
// import from a single path: `import { MyIsland } from '../islands'`.

export { default as LanguageSelectorIsland } from './shared/LanguageSelectorIsland.astro';
export { default as ServiceStatusIsland } from './admin/ServiceStatusIsland.astro';
export { default as UserProfileCard } from './dashboard/UserProfileCard.astro';
export { default as DashboardBookingWidget } from './dashboard/DashboardBookingWidget.astro';
export { default as CaminoStageProgress } from './camino/CaminoStageProgress.astro';
export { default as FAQAccordion } from './info/FAQAccordion.astro';
export { default as ContactForm } from './info/ContactForm.astro';
export { default as BookingShareActions } from './booking/BookingShareActions.astro';
