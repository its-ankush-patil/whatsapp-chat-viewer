// Shared helpers for the browser-driven scripts (e2e + docs screenshots).
// Uses playwright-core with the Edge/Chrome already installed on your machine,
// so no browser download is needed.
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173/'
export const sampleFile = (...p) => join(ROOT, 'samples', ...p)
export const publicFile = (...p) => join(ROOT, 'public', ...p)
export const PHOTOS = [
  publicFile('sample', 'IMG-20231023-WA0001.jpg'),
  publicFile('sample', 'IMG-20231024-WA0002.jpg'),
]

export async function launch({ scale = 1, viewport = { width: 1280, height: 900 } } = {}) {
  let browser
  for (const channel of ['msedge', 'chrome']) {
    try {
      browser = await chromium.launch({ channel, headless: true })
      break
    } catch {
      /* try next */
    }
  }
  if (!browser) throw new Error('Neither Microsoft Edge nor Google Chrome could be launched.')
  const context = await browser.newContext({ viewport, deviceScaleFactor: scale, acceptDownloads: true })
  const page = await context.newPage()
  const problems = []
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`))
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  return { browser, context, page, problems }
}

/** Load files via the landing page's hidden file input (or the toolbar's once a chat is open) */
export async function uploadFiles(page, files) {
  const selector = (await page.locator('#toolbar').count()) ? '#toolbar input[type=file]' : '#drop-zone input[type=file] >> nth=0'
  await page.setInputFiles(selector, files)
  await page.waitForSelector('#chat-frame, #empty-state')
}

export async function reset(page) {
  await page.click('#btn-reset')
  await page.waitForSelector('#drop-zone')
}
