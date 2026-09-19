interface SocialIconProps {
  className?: string;
}

export function FacebookIcon({ className = 'w-5 h-5' }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.98H7.9V12h2.6V9.8c0-2.57 1.53-3.99 3.87-3.99 1.12 0 2.3.2 2.3.2v2.53h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.89h-2.4v6.98A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function InstagramIcon({ className = 'w-5 h-5' }: SocialIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TwitterIcon({ className = 'w-5 h-5' }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 3H21.7L15.6 10.02 22.8 21H17.2L12.8 14.98 7.7 21H4.9L11.4 13.46 4.5 3H10.2L14.2 8.53 18.9 3ZM17.9 19.3H19.4L9.5 4.6H7.9L17.9 19.3Z" />
    </svg>
  );
}

export function YoutubeIcon({ className = 'w-5 h-5' }: SocialIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.5 7.2a2.8 2.8 0 0 0-1.97-1.98C18.9 4.75 12 4.75 12 4.75s-6.9 0-8.53.47A2.8 2.8 0 0 0 1.5 7.2 29.4 29.4 0 0 0 1 12a29.4 29.4 0 0 0 .5 4.8 2.8 2.8 0 0 0 1.97 1.98C5.1 19.25 12 19.25 12 19.25s6.9 0 8.53-.47a2.8 2.8 0 0 0 1.97-1.98A29.4 29.4 0 0 0 23 12a29.4 29.4 0 0 0-.5-4.8ZM9.9 15.2V8.8L15.6 12 9.9 15.2Z" />
    </svg>
  );
}
