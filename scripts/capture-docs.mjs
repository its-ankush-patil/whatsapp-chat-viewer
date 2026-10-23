// Regenerates every screenshot used in the docs:  npm run dev  →  npm run docs:screenshots
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { BASE_URL, PHOTOS, ROOT, launch, reset, sampleFile, uploadFiles } from './lib/browser.mjs'

const OUT = join(ROOT, 'docs', 'screenshots')
mkdirSync(OUT, { recursive: true })
const shot = (name) => join(OUT, `${name}.png`)

const { browser, page } = await launch({ scale: 1.5, viewport: { width: 1280, height: 1000 } })
const log = (n) => console.log('📸', n)

try {
  await page.goto(BASE_URL)
  await page.waitForSelector('#drop-zone')
  await page.screenshot({ path: shot('01-landing') })
  log('01-landing')

  // drag overlay look (simulated drag over the landing page)
  await page.evaluate(() => {
    const dt = new DataTransfer()
    dt.items.add(new File(['x'], 'x.txt'))
    document.querySelector('#drop-zone').parentElement.dispatchEvent(new DragEvent('dragenter', { dataTransfer: dt, bubbles: true, cancelable: true }))
  })
  await page.waitForTimeout(400)
  await page.locator('#drop-zone').screenshot({ path: shot('02-drop-zone-active') })
  log('02-drop-zone-active')
  await page.reload()
  await page.waitForSelector('#drop-zone')

  // sample chat (desktop)
  await page.click('#btn-sample')
  await page.waitForSelector('#chat-frame')
  await page.waitForFunction(() => [...document.images].filter((i) => i.naturalWidth > 0).length >= 2)
  await page.waitForTimeout(500)
  await page.screenshot({ path: shot('03-chat-desktop') })
  log('03-chat-desktop')
  await page.locator('#toolbar').screenshot({ path: shot('04-toolbar') })
  log('04-toolbar')

  // mobile view
  await page.click('#btn-toggle-mobile')
  await page.waitForTimeout(500)
  await page.locator('#chat-frame').screenshot({ path: shot('05-mobile-light'), omitBackground: true })
  log('05-mobile-light')
  await page.click('#btn-theme-dark')
  await page.waitForTimeout(200)
  await page.locator('#chat-frame').screenshot({ path: shot('06-mobile-dark'), omitBackground: true })
  log('06-mobile-dark')
  await page.screenshot({ path: shot('07-page-mobile-view') })
  log('07-page-mobile-view')
  await page.click('#btn-theme-light')

  // the PNG produced by "Download Screenshot"
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#btn-screenshot')])
  await download.saveAs(shot('08-downloaded-screenshot'))
  log('08-downloaded-screenshot')

  // date range filter
  await page.fill('#input-from', '2023-10-24')
  await page.waitForTimeout(300)
  await page.screenshot({ path: shot('09-date-filter') })
  log('09-date-filter')
  await page.fill('#input-from', '')

  // other samples (mobile view stays on)
  const cases = [
    ['10-ios', [sampleFile('ios', '_chat.txt'), ...PHOTOS]],
    ['11-us-12h', [sampleFile('us-12h', '_chat.txt'), ...PHOTOS]],
    ['12-group', [sampleFile('group', 'WhatsApp Chat - Weekend Hikers.txt'), ...PHOTOS]],
    ['13-edge-cases', [sampleFile('edge-cases', '_chat.txt'), ...PHOTOS]],
  ]
  for (const [name, files] of cases) {
    await reset(page)
    await uploadFiles(page, files)
    await page.waitForTimeout(600)
    await page.locator('#chat-frame').screenshot({ path: shot(name), omitBackground: true })
    log(name)
  }

  // missing media warning in the toolbar (edge-cases without photos)
  await reset(page)
  await uploadFiles(page, [sampleFile('edge-cases', '_chat.txt')])
  await page.waitForTimeout(400)
  await page.locator('#toolbar').screenshot({ path: shot('14-missing-media-warning') })
  log('14-missing-media-warning')

  // empty state
  await reset(page)
  await page.setInputFiles('#drop-zone input[type=file] >> nth=0', {
    name: 'notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not a chat'),
  })
  await page.waitForSelector('#empty-state')
  await page.locator('#empty-state').screenshot({ path: shot('15-empty-state') })
  log('15-empty-state')
} finally {
  await browser.close()
}
