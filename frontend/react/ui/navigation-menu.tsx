import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDownIcon } from '../doodle/DoodleIcons';

import { cn } from './utils';

function NavigationMenu({
  className,
  children,
  viewport = false,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn('group/navigation-menu relative flex max-w-max flex-1 items-center', className)}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn('group flex flex-1 list-none items-center space-x-1', className)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn('relative', className)}
      {...props}
    />
  );
}

/** Doodle-restyled: transparent background, green active/open state, same
 * px-4 py-2 sizing as DesktopNavLink for visual parity with plain links. */
const navigationMenuTriggerStyle = cva(
  'group inline-flex h-auto w-max items-center justify-center rounded-md px-4 py-2 text-gray-700 transition-colors hover:text-[#00AB39] focus:text-[#00AB39] focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-[#00AB39] focus-visible:ring-2 focus-visible:ring-[#00AB39] focus-visible:ring-offset-2'
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), 'group', className)}
      {...props}
    >
      {children}{' '}
      <ChevronDownIcon
        className="relative top-px ml-1 size-3.5 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

/** Doodle-restyled panel: paper-texture cream background, hand-drawn border
 * and shadow (matching DoodleCard/Navigation's mobile menu), plain CSS
 * opacity/scale transition keyed to Radix's data-state -- this project has
 * no tailwindcss-animate plugin for the animate-in/fade-in/zoom-in classes
 * the shadcn reference uses, so a plain data-state transition (which Radix
 * supports natively) replaces them rather than silently doing nothing. */
function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        'left-0 top-0 w-full p-2 transition-[opacity,transform] duration-200 md:absolute md:w-auto',
        'data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[motion=from-end]:data-[state=open]:translate-x-0 data-[state=closed]:opacity-0 data-[state=closed]:scale-95',
        // Without a shared Viewport (our case -- Navigation renders
        // `viewport={false}`), content must hang below the trigger
        // (top-full), not overlap it from the item's own top edge
        // (the unqualified top-0 above, which only makes sense when a
        // shared Viewport computes position separately).
        'group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:overflow-hidden',
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute left-0 top-full isolate z-50 flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          'relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top-center overflow-hidden rounded-xl border-2 border-[#5D4E37]/30 bg-[#FFFFFF] paper-texture doodle-shadow transition-[width,height] duration-200 md:w-[var(--radix-navigation-menu-viewport-width)]',
          className
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        'flex flex-col gap-1 rounded-sm p-2 text-sm text-gray-700 outline-none transition-colors hover:text-[#00AB39] focus:text-[#00AB39] focus-visible:ring-2 focus-visible:ring-[#00AB39] data-[active]:font-semibold data-[active]:text-[#00AB39]',
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden transition-opacity duration-200 data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100',
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-[#5D4E37]/30" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
