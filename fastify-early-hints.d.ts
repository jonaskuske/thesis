// https://github.com/fastify/fastify-early-hints/pull/45

export {}

type EarlyHintAs = 'document' | 'script' | 'image' | 'style' | 'font'
type EarlyHintCORS = 'anonymous' | 'use-credentials' | 'crossorigin'
type EarlyHintRel = 'dns-prefetch' | 'preconnect' | 'prefetch' | 'preload' | 'prerender'
interface EarlyHintItem {
  href: string
  rel: EarlyHintRel
  cors?: boolean | EarlyHintCORS
  as?: EarlyHintAs
}

declare module 'fastify' {
  interface FastifyReply extends import('fastify').FastifyReply {
    writeEarlyHintsLinks: (content: (string | EarlyHintItem)[]) => Promise<void>
  }
}
