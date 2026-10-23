import {
  ATTACHED_TAG_RE,
  FILE_ATTACHED_RE,
  OMITTED_RE,
  STICKER_NAME_RE,
  VOICE_NAME_RE,
} from './patterns.js'

/* ==========================================================================
 * Media detection & matching
 * ========================================================================== */

const EXT_KIND = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'bmp', 'avif', 'svg'],
  video: ['mp4', 'mov', '3gp', 'webm', 'mkv', 'm4v'],
  audio: ['opus', 'mp3', 'm4a', 'ogg', 'aac', 'wav', 'amr', 'caf'],
}

/**
 * Strips path traversal sequences, directory delimiters, control characters,
 * and invisible directional marks from media filenames.
 * @param {string} name
 * @returns {string} Safe base filename
 */
export function sanitizeFileName(name = '') {
  if (typeof name !== 'string') return ''
  // oxlint-disable-next-line eslint/no-control-regex
  let clean = name.replace(/[\u0000-\u001f\u007f\u200E\u200F\u202A-\u202E\uFEFF]/g, '')
  // Extract basename by stripping directory paths (POSIX and Windows)
  const lastSlash = Math.max(clean.lastIndexOf('/'), clean.lastIndexOf('\\'))
  if (lastSlash !== -1) {
    clean = clean.slice(lastSlash + 1)
  }
  return clean.trim()
}

/**
 * @typedef {'image'|'video'|'audio'|'sticker'|'voice'|'document'|'omitted'} MediaKind
 * @returns {MediaKind}
 */
export function kindFromFileName(name = '') {
  const clean = sanitizeFileName(name)
  const ext = clean.split('.').pop().toLowerCase()
  if (ext === 'webp' && STICKER_NAME_RE.test(clean)) return 'sticker'
  if (EXT_KIND.audio.includes(ext) && VOICE_NAME_RE.test(clean)) return 'voice'
  for (const [kind, exts] of Object.entries(EXT_KIND)) {
    if (exts.includes(ext)) return kind
  }
  return 'document'
}

/**
 * Normalised lookup key for a media file name. Case-insensitive, strips
 * invisible marks, removes path traversal, and unifies Unicode.
 */
export function mediaKey(name = '') {
  return sanitizeFileName(name)
    .normalize('NFC')
    .toLowerCase()
}

/**
 * Looks for an attachment marker in a message body.
 * @param {string} text
 * @param {Map<string,{url:string}>} mediaMap  keyed by mediaKey()
 * @returns {{media: null|{fileName:string|null,kind:MediaKind,url:string|null}, caption:string}}
 */
export function resolveMedia(text, mediaMap) {
  const trimmed = text.trim()

  if (OMITTED_RE.test(trimmed)) {
    return { media: { fileName: null, kind: 'omitted', url: null }, caption: '' }
  }

  let fileName = null
  let caption = trimmed

  const tag = trimmed.match(ATTACHED_TAG_RE)
  if (tag) {
    fileName = sanitizeFileName(tag[1])
    caption = trimmed.replace(tag[0], '').trim()
  } else {
    const att = trimmed.match(FILE_ATTACHED_RE)
    if (att) {
      fileName = sanitizeFileName(att[1])
      caption = trimmed.slice(att[0].length).trim()
    }
  }

  if (!fileName) return { media: null, caption: text }

  const found = mediaMap.get(mediaKey(fileName))
  return {
    media: {
      fileName,
      kind: kindFromFileName(fileName),
      url: found ? found.url : null,
    },
    caption,
  }
}
