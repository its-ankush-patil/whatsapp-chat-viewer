/**
 * @file Type definitions and runtime validation contracts for WhatsApp Chat Viewer.
 */

/**
 * @typedef {'image' | 'video' | 'audio' | 'voice' | 'sticker' | 'document' | 'omitted'} MediaKind
 */

/**
 * @typedef {Object} MediaAttachment
 * @property {string|null} fileName - Extracted filename of the media attachment
 * @property {MediaKind} kind - Categorized attachment type
 * @property {string|null} url - Browser Object URL (blob:) or null if missing
 */

/**
 * @typedef {Object} WhatsAppMessage
 * @property {number} id - Unique incremental message identifier
 * @property {Date|null} date - JavaScript Date instance or null for system events without date
 * @property {string} time - Formatted display timestamp (e.g., "10:15" or "10:15 AM")
 * @property {string|null} sender - Author name or phone number, or null for system notices
 * @property {string} text - Message text content or empty string
 * @property {MediaAttachment|null} media - Linked media payload or null
 * @property {boolean} deleted - True if message was deleted
 * @property {boolean} edited - True if message was edited post-sending
 * @property {string} [_searchable] - Precomputed normalized lowercase text for search indexing
 */

/**
 * @typedef {Object} ChatMeta
 * @property {'android' | 'ios' | 'mixed' | 'unknown'} format - Detected export format
 * @property {'DMY' | 'MDY'} dateOrder - Statistical date order
 * @property {'12h' | '24h'} clock - Time display standard
 * @property {number} totalLines - Raw line count processed
 * @property {number} ignoredLines - Lines skipped before initial timestamp
 */

/**
 * @typedef {Object} ParseResult
 * @property {WhatsAppMessage[]} messages - Ordered message timeline
 * @property {string[]} participants - Unique senders discovered in chat
 * @property {ChatMeta} meta - Detected archive metadata
 */

/**
 * Validates the runtime structural integrity of a parsed chat object.
 * @param {unknown} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateParseResult(data) {
  const errors = []
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Parse result must be a non-null object'] }
  }

  const res = /** @type {Record<string, unknown>} */ (data)

  if (!Array.isArray(res.messages)) {
    errors.push('Expected "messages" to be an Array')
  }

  if (!Array.isArray(res.participants)) {
    errors.push('Expected "participants" to be an Array')
  }

  if (!res.meta || typeof res.meta !== 'object') {
    errors.push('Expected "meta" to be an Object')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
