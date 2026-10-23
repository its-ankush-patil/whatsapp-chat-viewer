/* ==========================================================================
 * Regular expressions used by the parser.
 * Everything format-specific lives here so new locales/layouts can be added
 * in a single place. See docs/SUPPORTED_FORMATS.md for the full matrix.
 * ========================================================================== */

// Invisible characters WhatsApp sprinkles into exports.
export const SPACE_LIKE = /[\u202F\u00A0\u2009]/g // narrow NBSP etc. -> normal space
export const INVISIBLE = /[\u200E\u200F\u202A-\u202E\uFEFF]/g // LRM, RLM, BOM, bidi controls

// --- Building blocks ---------------------------------------------------------
/** 23/10/2023  23.10.23  10-23-23  2023-10-23  2023/10/23 */
const DATE = String.raw`(\d{1,4}[\/.\-]\d{1,2}[\/.\-]\d{1,4})`
/** 10:15  10:15:30  10.15  10:15 PM  10:15 p. m.  10:15pm */
const TIME = String.raw`(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s?[AaPp]\.?\s?[Mm]\.?)?)`

// --- Line headers -------------------------------------------------------------
/** iOS:  [23/10/23, 10:15:30] Sender: Message */
export const IOS_LINE_RE = new RegExp(String.raw`^\[${DATE},?\s+${TIME}\]\s+(.*)$`)
/** Android:  23/10/2023, 10:15 - Sender: Message */
export const ANDROID_LINE_RE = new RegExp(String.raw`^${DATE},?\s+${TIME}\s+-\s+(.*)$`)

// --- Sender splitting ---------------------------------------------------------
/** First ":" that is followed by whitespace / end of line separates sender from text */
export const SENDER_SPLIT_RE = /:(?:\s|$)/

// --- Media markers --------------------------------------------------------------
/** iOS:  <attached: IMG-20231023.jpg> */
export const ATTACHED_TAG_RE = /<attached:\s*([^>]+?)\s*>/i
/** Android:  IMG-20231023.jpg (file attached)  (+ common localisations) */
export const FILE_ATTACHED_RE =
  /^\s*([^\n]+?\.[A-Za-z0-9]{2,5})\s*\((?:file attached|datei angehängt|archivo adjunto|fichier joint|arquivo anexado|file allegato|bestand toegevoegd|plik dołączony|файл добавлен|dosya ekli)\)/i
/** "<Media omitted>", "image omitted", ... (chat exported WITHOUT media) */
export const OMITTED_RE =
  /^<?\s*(media|image|video|audio|sticker|gif|document|voice message|contact card|location|live location|poll)\s+omitted\s*>?$/i

/** Sticker file names: Android STK-2023…webp, iOS 0000-STICKER-2023…webp */
export const STICKER_NAME_RE = /(^STK-|-STICKER-)/i
/** Voice notes: Android PTT-2023…opus, iOS 0000-AUDIO-…opus */
export const VOICE_NAME_RE = /(^PTT-|-AUDIO-)/i

// --- Message state --------------------------------------------------------------
export const DELETED_RE =
  /^(you deleted this message|this message was deleted|🚫\s*this message was deleted|🚫\s*you deleted this message)\.?$/i
export const EDITED_SUFFIX_RE = /\s*<This message was edited>\s*$/i

/**
 * iOS prefixes the encryption notice (and some other system lines) with the
 * chat name as if it were a sender. Those must be rendered as system messages.
 */
export const SYSTEM_TEXT_RE =
  /^(messages and calls are end-to-end encrypted|your security code with .+ changed|this chat is with a business account|you're now an admin|you were added|you joined)/i
