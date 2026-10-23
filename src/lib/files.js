/* ==========================================================================
 * File helpers: folder-aware drop handling + file classification
 * ========================================================================== */

const readFileEntry = (entry) => new Promise((resolve, reject) => entry.file(resolve, reject))

async function readEntry(entry) {
  if (entry.isFile) return [await readFileEntry(entry)]
  if (entry.isDirectory) {
    const reader = entry.createReader()
    const children = []
    // readEntries returns results in batches until it yields an empty array
    for (;;) {
      const batch = await new Promise((res, rej) => reader.readEntries(res, rej))
      if (!batch.length) break
      children.push(...batch)
    }
    return (await Promise.all(children.map(readEntry))).flat()
  }
  return []
}

/** Flattens dropped files AND dropped folders (recursively) into a File[] */
export async function collectDroppedFiles(dataTransfer) {
  // Entries must be grabbed synchronously, before the first `await`
  const entries = Array.from(dataTransfer.items ?? [])
    .map((item) => item.webkitGetAsEntry?.())
    .filter(Boolean)
  if (!entries.length) return Array.from(dataTransfer.files)
  return (await Promise.all(entries.map(readEntry))).flat()
}

/** WhatsApp chat exports are plain .txt files */
export const isChatFile = (file) => /\.txt$/i.test(file.name)

/** OS junk that often rides along when whole folders are dropped */
export const isJunkFile = (file) => /^(\.DS_Store|Thumbs\.db|desktop\.ini)$/i.test(file.name)
