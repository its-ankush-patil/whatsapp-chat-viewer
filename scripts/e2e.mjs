// End-to-end smoke test:  npm run dev   (in another terminal)   then   npm run e2e
import assert from 'node:assert/strict'
import { mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { BASE_URL, PHOTOS, ROOT, launch, reset, sampleFile, uploadFiles } from './lib/browser.mjs'

const OUT = join(ROOT, 'test-output')
mkdirSync(OUT, { recursive: true })

const { browser, page, problems } = await launch()
let step = 0
const ok = (msg) => console.log(`✔ ${String(++step).padStart(2, '0')} ${msg}`)

try {
  await page.goto(BASE_URL)
  await page.waitForSelector('#drop-zone')
  ok('landing page renders')

  // --- sample button (fetches bundled photos) -----------------------------
  await page.click('#btn-sample')
  await page.waitForSelector('#chat-frame')
  await page.waitForFunction(() => [...document.images].filter((i) => i.naturalWidth > 0).length >= 2)
  ok('sample chat renders with 2 real photos')
  assert.equal(await page.locator('h1', { hasText: 'Maya' }).count(), 1, 'contact name from file name')

  // --- bubble alignment & colours ------------------------------------------
  const colours = await page.evaluate(() => {
    const frame = document.getElementById('chat-frame').getBoundingClientRect()
    const bubbles = [...document.querySelectorAll('#chat-frame .rounded-lg.relative, #chat-frame [class*="bg-wa-out"], #chat-frame [class*="bg-wa-in"]')]
    const out = bubbles.find((b) => b.className.includes('bg-wa-out'))
    const inc = bubbles.find((b) => b.className.includes('bg-wa-in'))
    return {
      out: getComputedStyle(out).backgroundColor,
      inc: getComputedStyle(inc).backgroundColor,
      outRight: out.getBoundingClientRect().right > frame.left + frame.width / 2,
      incLeft: inc.getBoundingClientRect().left < frame.left + frame.width / 2,
    }
  })
  assert.equal(colours.out, 'rgb(220, 248, 198)')
  assert.equal(colours.inc, 'rgb(255, 255, 255)')
  assert.ok(colours.outRight && colours.incLeft, 'outgoing right / incoming left')
  ok('outgoing bubbles green & right, incoming white & left')

  // --- mobile view ------------------------------------------------------------
  await page.click('#btn-toggle-mobile')
  await page.waitForTimeout(450) // width/height transition
  const box = await page.locator('#chat-frame').boundingBox()
  assert.equal(Math.round(box.width), 393)
  assert.equal(Math.round(box.height), 852)
  ok(`mobile view is ${Math.round(box.width)}×${Math.round(box.height)}`)

  // --- theme -------------------------------------------------------------------
  await page.click('#btn-theme-dark')
  assert.ok((await page.locator('#chat-frame').getAttribute('class')).includes('wa-dark'))
  ok('dark theme applies')
  await page.click('#btn-theme-light')

  // --- display name override ----------------------------------------------------
  await page.fill('#input-display-name', 'Best Friend')
  assert.equal(await page.locator('#chat-frame h1').innerText(), 'Best Friend')
  await page.fill('#input-display-name', '')
  ok('chat name override works')

  // --- date range filter ---------------------------------------------------------
  const before = await page.locator('#chat-frame .rounded-lg.relative').count()
  await page.fill('#input-from', '2023-10-24')
  const after = await page.locator('#chat-frame .rounded-lg.relative').count()
  assert.ok(after < before && after > 0, `date filter reduces bubbles (${before} → ${after})`)
  await page.fill('#input-from', '')
  ok('date range filter works')

  // --- in-chat search -----------------------------------------------------------
  await page.click('#btn-toolbar-search')
  await page.waitForSelector('#input-chat-search')
  await page.fill('#input-chat-search', 'morning')
  await page.waitForSelector('#search-match-count')
  const matchText = await page.locator('#search-match-count').innerText()
  assert.match(matchText, /\d+\s+of\s+\d+/, 'search match counter displayed')
  await page.click('#btn-search-next')
  await page.click('#btn-search-prev')
  await page.click('#btn-close-search')
  assert.equal(await page.locator('#input-chat-search').count(), 0, 'search closes cleanly')
  ok('in-chat search: input, counter, navigation & close')

  // --- "I am" swaps sides ----------------------------------------------------------
  const rightBefore = await page.evaluate(() => document.querySelectorAll('#chat-frame [class*="bg-wa-out"]').length)
  await page.selectOption('#select-me', { index: 0 })
  const rightAfter = await page.evaluate(() => document.querySelectorAll('#chat-frame [class*="bg-wa-out"]').length)
  assert.notEqual(rightBefore, rightAfter)
  ok('"I am" switches which side is outgoing')

  // --- screenshot download ----------------------------------------------------------
  const [download] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.click('#btn-screenshot')])
  const file = join(OUT, 'screenshot.png')
  await download.saveAs(file)
  assert.ok(statSync(file).size > 20_000, 'screenshot PNG is non-trivial')
  ok(`screenshot downloaded (${Math.round(statSync(file).size / 1024)} KB)`)

  // --- reset + edge cases -------------------------------------------------------------
  await reset(page)
  await uploadFiles(page, [sampleFile('edge-cases', '_chat.txt'), ...PHOTOS])
  const text = await page.locator('#chat-frame').innerText()
  for (const expected of ['File not uploaded', 'Media omitted', 'This message was deleted', 'Edited', 'Contract.pdf', 'Missed voice call'])
    assert.ok(text.includes(expected), `edge-cases shows "${expected}"`)
  ok('edge cases: missing media, omitted, deleted, edited, document, calls')

  // --- all bundled samples load ----------------------------------------------------------
  for (const [name, files, contact] of [
    ['ios', [sampleFile('ios', '_chat.txt'), ...PHOTOS], null],
    ['us-12h', [sampleFile('us-12h', '_chat.txt'), ...PHOTOS], null],
    ['group', [sampleFile('group', 'WhatsApp Chat - Weekend Hikers.txt'), ...PHOTOS], 'Weekend Hikers'],
  ]) {
    await reset(page)
    await uploadFiles(page, files)
    assert.ok(await page.locator('#chat-frame').count(), `${name} renders`)
    if (contact) assert.equal(await page.locator('#chat-frame h1').innerText(), contact)
    ok(`sample "${name}" renders`)
  }

  // --- empty state -----------------------------------------------------------------------------
  await reset(page)
  await page.setInputFiles('#drop-zone input[type=file] >> nth=0', {
    name: 'notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('this is not a whatsapp export'),
  })
  await page.waitForSelector('#empty-state')
  ok('non-chat .txt shows a helpful empty state')

  // --- in-app documentation search modal ---------------------------------------
  await page.click('#btn-nav-docs')
  await page.waitForSelector('#input-docs-search')
  await page.fill('#input-docs-search', 'iphone')
  assert.ok(await page.locator('text=Exporting WhatsApp Chat on iPhone (iOS)').count() >= 1, 'docs search finds iPhone export article')
  await page.click('#btn-close-docs')
  await page.waitForSelector('#input-docs-search', { state: 'detached' })
  ok('in-app documentation search: open, query filter & close')

  assert.deepEqual(problems, [], `browser errors:\n${problems.join('\n')}`)
  ok('no console errors')
  console.log('\nE2E passed ✅')
} catch (err) {
  await page.screenshot({ path: join(OUT, 'failure.png'), fullPage: true }).catch(() => {})
  console.error('\nE2E FAILED ❌ (see test-output/failure.png)\n', err)
  process.exitCode = 1
} finally {
  await browser.close()
}
