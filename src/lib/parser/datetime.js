/* ==========================================================================
 * Date & time handling
 * ========================================================================== */

/**
 * Decide whether the export is day-first (dd/mm) or month-first (mm/dd).
 * Any value > 12 in the first/second slot settles it; default is day-first.
 * @param {string[]} rawDates
 * @returns {'DMY'|'MDY'}
 */
export function detectDateOrder(rawDates) {
  let dayFirstEvidence = false
  let monthFirstEvidence = false
  for (const d of rawDates) {
    const parts = d.split(/[/.-]/)
    if (parts[0].length === 4) continue // yyyy-mm-dd, unambiguous
    if (Number(parts[0]) > 12) dayFirstEvidence = true
    if (Number(parts[1]) > 12) monthFirstEvidence = true
  }
  if (monthFirstEvidence && !dayFirstEvidence) return 'MDY'
  return 'DMY'
}

/** @returns {{day:number, month:number, year:number}} */
export function parseDate(dateStr, order) {
  const parts = dateStr.split(/[/.-]/)
  let day, month, year
  if (parts[0].length === 4) {
    ;[year, month, day] = parts.map(Number)
  } else if (order === 'MDY') {
    ;[month, day, year] = parts.map(Number)
  } else {
    ;[day, month, year] = parts.map(Number)
  }
  if (year < 100) year += 2000
  return { day, month, year }
}

/**
 * @returns {{hours:number, minutes:number, display:string}}
 *   `display` keeps the user's clock style: "10:15" or "10:15 PM" (seconds dropped)
 */
export function parseTime(timeStr) {
  const m = timeStr.match(/^(\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?/)
  if (!m) return { hours: 0, minutes: 0, display: timeStr }
  let hours = Number(m[1])
  const minutes = Number(m[2])
  const meridiem = timeStr.match(/([AaPp])\.?\s?[Mm]/)
  let display
  if (meridiem) {
    const isPM = meridiem[1].toLowerCase() === 'p'
    display = `${hours}:${m[2]} ${isPM ? 'PM' : 'AM'}`
    if (isPM && hours < 12) hours += 12
    if (!isPM && hours === 12) hours = 0
  } else {
    display = `${String(hours).padStart(2, '0')}:${m[2]}`
  }
  return { hours, minutes, display }
}
