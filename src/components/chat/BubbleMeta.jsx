import { Ticks } from '../Icons'

/**
 * Bubble tail (SVG paths matching WhatsApp Web geometry).
 */
export function Tail({ outgoing, fills }) {
  return outgoing ? (
    <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -right-[8px]" aria-hidden="true">
      <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" fill={fills.out} />
    </svg>
  ) : (
    <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -left-[8px]" aria-hidden="true">
      <path d="M2.812 1H8v11.193L1.533 3.568C.474 2.156 1.042 1 2.812 1z" fill={fills.in} />
    </svg>
  )
}

/**
 * Timestamp metadata badge (+ "Edited", + ticks for outgoing).
 * `overlay` renders high-contrast white text for media attachments.
 */
export function Meta({ time, outgoing, edited, overlay = false, className = '' }) {
  return (
    <span
      className={`flex items-center gap-[3px] text-[11px] leading-[15px] select-none ${
        overlay ? 'text-white' : 'text-wa-meta'
      } ${className}`}
    >
      {edited && <span className="mr-0.5 italic">Edited</span>}
      {time}
      {outgoing && <Ticks className={overlay ? 'text-white' : 'text-wa-tick'} />}
    </span>
  )
}
