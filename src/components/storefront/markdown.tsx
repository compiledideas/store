import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

const components: Components = {
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="text-lagoon-deep underline underline-offset-2 hover:text-lagoon"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc space-y-1 pl-5" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal space-y-1 pl-5" {...props}>{children}</ol>
  ),
  h1: ({ children, ...props }) => (
    <h1 className="mb-3 mt-6 text-2xl font-bold text-foreground first:mt-0" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mb-2 mt-5 text-xl font-bold text-foreground" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-2 mt-4 text-lg font-bold text-foreground" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-3 leading-relaxed last:mb-0" {...props}>{children}</p>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>{children}</strong>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="my-4 border-l-4 border-lagoon-deep pl-4 italic text-muted-foreground" {...props}>{children}</blockquote>
  ),
}

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown components={components}>
      {content}
    </ReactMarkdown>
  )
}
