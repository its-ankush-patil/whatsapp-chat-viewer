import { Fragment } from 'react'

/**
 * WhatsApp inline formatting + auto-links + search highlighting:
 *   *bold*  _italic_  ~strike~  `mono`  https://links
 */
const TOKEN_RE = /(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~|`[^`\n]+`|https?:\/\/[^\s]+)/g

/** Bounded LRU cache size for tokenized message bodies */
const TOKEN_CACHE_LIMIT = 5000
const tokenCache = new Map()

/**
 * Validates and sanitizes URLs before rendering them as hyperlinks.
 * Enforces strict HTTP/HTTPS protocol whitelist and strips trailing sentence punctuation.
 */
export function sanitizeUrl(raw) {
  if (typeof raw !== 'string') return null
  // Strip trailing punctuation common in chat text (e.g., '.', ',', '!', ')')
  const trimmed = raw.replace(/[.,!?;:)]+$/, '')
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return { href: parsed.href, display: trimmed }
    }
  } catch {
    // Malformed URL fallback
  }
  return null
}

/**
 * Parses and tokenizes raw message strings into an AST with LRU caching.
 * Prevents repetitive regular expression parsing on search keystrokes.
 */
export function tokenizeText(text) {
  if (tokenCache.has(text)) {
    const cached = tokenCache.get(text)
    tokenCache.delete(text)
    tokenCache.set(text, cached)
    return cached
  }

  const parts = text.split(TOKEN_RE)
  const tokens = []
  for (const part of parts) {
    if (!part) continue
    if (/^https?:\/\//i.test(part)) {
      const sanitized = sanitizeUrl(part)
      if (sanitized) {
        tokens.push({
          type: 'link',
          href: sanitized.href,
          display: sanitized.display,
          trailing: part.slice(sanitized.display.length),
        })
        continue
      }
    }
    if (part.length > 2) {
      if (part[0] === '*' && part.endsWith('*')) {
        tokens.push({ type: 'bold', content: part.slice(1, -1) })
        continue
      }
      if (part[0] === '_' && part.endsWith('_')) {
        tokens.push({ type: 'italic', content: part.slice(1, -1) })
        continue
      }
      if (part[0] === '~' && part.endsWith('~')) {
        tokens.push({ type: 'strike', content: part.slice(1, -1) })
        continue
      }
      if (part[0] === '`' && part.endsWith('`')) {
        tokens.push({ type: 'mono', content: part.slice(1, -1) })
        continue
      }
    }
    tokens.push({ type: 'text', content: part })
  }

  if (tokenCache.size >= TOKEN_CACHE_LIMIT) {
    const firstKey = tokenCache.keys().next().value
    tokenCache.delete(firstKey)
  }
  tokenCache.set(text, tokens)
  return tokens
}

function highlightQuery(content, query, isCurrentMatch) {
  if (!query || typeof content !== 'string' || !content) return content
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = content.split(new RegExp(`(${escaped})`, 'gi'))
  if (parts.length <= 1) return content

  return parts.map((part, i) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <mark
          key={i}
          className={`${
            isCurrentMatch
              ? 'bg-[#ff9800] text-black font-semibold ring-2 ring-[#ff9800]/60'
              : 'bg-[#ffd200] text-black'
          } rounded-[2px] px-[2px] transition-all duration-200`}
        >
          {part}
        </mark>
      )
    }
    return part
  })
}

export function formatText(text, searchQuery = '', isCurrentMatch = false) {
  if (!text) return null
  const query = searchQuery?.trim()
  const tokens = tokenizeText(text)

  return tokens.map((token, i) => {
    switch (token.type) {
      case 'link':
        return (
          <Fragment key={i}>
            <a
              href={token.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-wa-link underline-offset-2 hover:underline"
            >
              {highlightQuery(token.display, query, isCurrentMatch)}
            </a>
            {token.trailing ? highlightQuery(token.trailing, query, isCurrentMatch) : null}
          </Fragment>
        )
      case 'bold':
        return <strong key={i}>{highlightQuery(token.content, query, isCurrentMatch)}</strong>
      case 'italic':
        return <em key={i}>{highlightQuery(token.content, query, isCurrentMatch)}</em>
      case 'strike':
        return <s key={i}>{highlightQuery(token.content, query, isCurrentMatch)}</s>
      case 'mono':
        return (
          <code key={i} className="font-mono text-[0.9em]">
            {highlightQuery(token.content, query, isCurrentMatch)}
          </code>
        )
      default:
        return <Fragment key={i}>{highlightQuery(token.content, query, isCurrentMatch)}</Fragment>
    }
  })
}
