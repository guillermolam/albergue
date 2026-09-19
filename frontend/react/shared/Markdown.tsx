import { useMemo } from 'react';
import MarkdownIt from 'markdown-it';

// `html: false` (the default) keeps raw HTML in the source escaped rather
// than executed -- content here can come from the backend, so this stays
// safe by construction without needing a separate sanitizer pass.
const md = new MarkdownIt({ linkify: true, breaks: true });

export interface MarkdownProps {
  source: string;
  className?: string;
}

export function Markdown({ source, className = '' }: Readonly<MarkdownProps>) {
  const html = useMemo(() => md.render(source), [source]);

  return (
    // eslint-disable-next-line react/no-danger
    <div className={`markdown-body ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
