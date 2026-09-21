/** Shared neobrutalist surface: hard black border + offset shadow + press. */
export const NEO =
  'border-2 border-[#1A1A1A] shadow-[5px_5px_0_0_#1A1A1A] transition-all duration-150 ease-out';

export const NEO_HOVER =
  'hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_#1A1A1A]';

export const NEO_ACTIVE =
  'active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_0_#1A1A1A]';

export const NEO_INTERACTIVE = `${NEO} ${NEO_HOVER} ${NEO_ACTIVE}`;

export const NEO_INPUT =
  'w-full rounded-md border-2 border-[#1A1A1A] bg-white px-3 py-2 text-[#1A1A1A] shadow-[3px_3px_0_0_#1A1A1A] transition-all duration-150 focus:outline-none focus:shadow-[1px_1px_0_0_#00AB39] focus:translate-x-[1px] focus:translate-y-[1px]';
