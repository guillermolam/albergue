#!/usr/bin/env bash
# Figma Make -> Astro 7 sync, despachado a opencode.
#
# Contexto: frontend/ es Astro 7 + UnoCSS. El prototipo Figma Make
# (nhtyfIO6mEsebEyAJtfjVB) es una SPA React + shadcn/ui + Tailwind.
# Ver FIGMA_ASTRO_GAP_ANALYSIS.md en la raiz del repo.
#
# PARALELISMO: BATCH 1 (tareas 1-3) puede correr en paralelo, tocan
# ficheros disjuntos. BATCH 2 (4-5) depende de 3. No lances BATCH 2
# hasta que 3 este en verde.
#
# ANTES DE EMPEZAR: abre en Figma Make
#   src/app/DOODLE_DESIGN_SYSTEM.md
#   src/app/MIGRATION_PLAN.md
# y pega su contenido en los prompts. Son la spec real; sin ellos
# opencode esta adivinando igual que yo.

set -euo pipefail
cd "$(dirname "$0")/frontend"

# ---------------------------------------------------------------- BATCH 1

task_tokens() {
opencode run "Este es un proyecto Astro 7 con UnoCSS en frontend/. Existe un prototipo
en Figma Make que es una SPA React con shadcn/ui + Tailwind, y tengo que hacer que
el Astro se vea identico. El bloqueo principal es que los dos usan namespaces de
variables CSS disjuntos y hay que unificarlos antes de portar nada.

shadcn define: --background --foreground --primary --primary-foreground --secondary
--muted --muted-foreground --accent --destructive --border --input --ring --radius
--card --card-foreground --popover.

Mi uno.config.ts define en cambio: --green-light --green-medium --green-dark
--green-darker --cream --light-grey --medium-grey --dark-grey --charcoal --paper-bg
--status-success --status-warning --status-error --status-info, mas fuentes
--font-handwritten --font-sketch --font-accent --font-mono.

Tarea: definir una capa de compatibilidad de tokens en src/styles/design-system.css
que exponga los nombres shadcn como alias de mis tokens semanticos, de modo que
cualquier componente shadcn portado funcione sin reescribir sus clases. Decide el
mapeo por semantica (--primary -> --green-dark, --background -> --paper-bg o --cream,
--border -> --light-grey, etc.), documenta cada decision en un comentario, y anade
--radius coherente con mi borderRadius doodle. No toques src/components/. No
inventes valores hex nuevos: reutiliza los que ya existen en design-system.css.

Lee primero src/styles/design-system.css, src/styles/figma-design.css,
src/styles/design-tokens.ts y uno.config.ts para ver que hay ya definido y no
duplicarlo.

Verifica con: pnpm run check:astro && pnpm run type-check && pnpm run build"
}

task_dedupe() {
opencode run "Proyecto Astro 7 en frontend/. src/components/ tiene componentes
duplicados con el mismo nombre en distintos subdirectorios, lo que hace que
distintas paginas importen variantes distintas del mismo componente y el sitio
se vea inconsistente.

Duplicados confirmados: Button.astro x3, Card.astro x3, Hero.astro x3,
FeatureCard.astro x2, InfoBadge.astro x2, Stats.astro x2, SketchyButton.astro x2,
DoodleCard.astro x2, Head.astro x2.

Tarea: para cada grupo de duplicados, localizar todas las copias, comparar props
y markup, elegir la variante canonica (la mas completa y mas usada), consolidar
en una sola ubicacion coherente con la estructura existente (core/ ui/ layout/
doodle/), borrar las demas y actualizar TODOS los imports del repo. Si dos copias
divergen de verdad en proposito, renombralas para que el nombre refleje la
diferencia en lugar de borrar una.

Entrega un resumen de que elegiste como canonico y por que, y que imports cambiaron.
No cambies estilos ni tokens: esto es solo consolidacion estructural.

Verifica con: pnpm run check:astro && pnpm run type-check && pnpm run build"
}

task_primitives() {
opencode run "Proyecto Astro 7 + UnoCSS en frontend/. Tengo que portar primitivas
de UI con comportamiento desde un prototipo React que usa shadcn/ui (Radix) a
Astro nativo sin framework de UI. Son las que bloquean todo lo demas porque el
flujo de reserva las necesita.

Portar, en este orden: dialog, select, tabs, accordion, calendar (date picker),
form (validacion), popover, tooltip, drawer/sheet, radio-group, checkbox, switch.

Requisitos duros, no negociables:
- Astro nativo. Sin React, Vue ni Svelte. Web Components / Custom Elements y
  vanilla script donde haga falta estado.
- Zero-JS primero: accordion con <details>/<summary>, dialog con <dialog> nativo.
  JS solo como progressive enhancement encima de algo que ya funciona sin el.
- Accesibilidad al nivel de Radix, que es lo que estoy perdiendo al salir de
  shadcn: roles ARIA correctos, focus trap en dialog/drawer, navegacion por
  teclado completa (flechas en tabs/select/calendar, Escape para cerrar,
  Home/End donde aplique), focus visible, aria-current, y respetar
  prefers-reduced-motion.
- Limpieza de listeners en astro:unmount (el proyecto usa Swup, hay navegacion
  SPA, los listeners se acumulan si no).
- Estilar con los shortcuts de UnoCSS que ya existen en uno.config.ts
  (btn, btn-primary, card, input, badge, sketch-border, doodle-border...).
  Lee uno.config.ts antes de escribir CSS nuevo.

Colocar en src/components/ui/. Un fichero .astro por primitiva. Documenta props
y eventos de cada una en un comentario de cabecera.

Verifica con: pnpm run check:astro && pnpm run type-check && pnpm run build && pnpm run e2e"
}

# ---------------------------------------------------------------- BATCH 2

task_booking() {
opencode run "Proyecto Astro 7 en frontend/. Tengo que portar el flujo de reserva
completo desde un prototipo React. Es la mayor brecha funcional del proyecto: en
React es una maquina de estados de seis pasos y en Astro no existe nada de esto.

Componentes del prototipo a portar:
- BookingStepper (orquestador, mantiene el estado del flujo)
- BedSelectionStep, DatePickerStep, PilgrimFormStep, IDUploadStep, PaymentStep
- PriceSummaryModal, PilgrimCard, AvailabilityGrid, FloatingCostSummary
- NewBookingFlow, BookingForm (envoltorios de nivel superior)

En Astro ya existe src/islands/booking/ y BookingConfirmation.astro: el final del
flujo. Lee primero que hay ahi y en src/stores/ para no duplicar.

Decisiones de arquitectura que quiero:
- El estado del flujo en nanostores (ya es dependencia), NO en React Context.
- Cada paso como una ruta propia en src/pages/ para que funcione sin JS y sea
  enlazable/compartible, con el stepper como layout. Progressive enhancement
  encima para que las transicciones entre pasos no recarguen.
- Reutiliza las primitivas de src/components/ui/ (dialog, calendar, form, select).
  Si falta alguna, dilo en lugar de improvisarla inline.
- Validacion de formulario en servidor ademas de cliente. La subida de ID y el
  paso de pago manejan datos personales: no confies en validacion de cliente.

Verifica con: pnpm run check:astro && pnpm run type-check && pnpm run build && pnpm run e2e"
}

task_pages() {
opencode run "Proyecto Astro 7 en frontend/. Faltan paginas y el chrome de
navegacion que si existen en el prototipo React.

Chrome (primero, lo usa todo lo demas): Navigation, Footer, LoginModal,
UserProfileMenu. Hay src/app/constants/footerData.ts en el prototipo con el
contenido del footer.

Paginas de contenido: HomePage, EmergenciesPage, RestaurantsPage, TourismPage,
VisitsPage, GuestDashboard.
Paginas legales: CookiePolicy, LegalNotice, PrivacyPolicy, TermsAndConditions.
Showcases: MeridaShowcase, LocalAreaShowcase, VisualAreaShowcase, IllustratedCard.

El proyecto es multiidioma (hay src/locales/ y wuchale, y el prototipo tiene un
I18nContext). Las paginas nuevas deben integrarse con el i18n existente, no
hardcodear texto. Lee src/locales/ y src/components/LanguageSelector/ primero.

Usa los layouts de src/layouts/ y las primitivas de src/components/ui/. Semantica
HTML correcta: landmarks, jerarquia de headings h1-h6 sin saltos, skip link,
aria-current=page en la navegacion activa.

Verifica con: pnpm run check:astro && pnpm run type-check && pnpm run build"
}

# ---------------------------------------------------------------- runner

case "${1:-}" in
  tokens)     task_tokens ;;
  dedupe)     task_dedupe ;;
  primitives) task_primitives ;;
  booking)    task_booking ;;
  pages)      task_pages ;;
  batch1)     task_tokens & task_dedupe & task_primitives & wait ;;
  batch2)     task_booking & task_pages & wait ;;
  *)
    echo "uso: $0 {tokens|dedupe|primitives|booking|pages|batch1|batch2}"
    echo
    echo "  batch1  tokens + dedupe + primitives   (paralelo, ficheros disjuntos)"
    echo "  batch2  booking + pages                (requiere batch1 en verde)"
    exit 1 ;;
esac
