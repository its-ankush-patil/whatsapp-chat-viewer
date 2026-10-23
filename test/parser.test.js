// Run with:  npm test        (uses Node's built-in test runner, no extra deps)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parseWhatsAppChat, mediaKey, kindFromFileName } from '../src/lib/parser/index.js'

const here = dirname(fileURLToPath(import.meta.url))
const sample = (...p) => readFileSync(join(here, '..', 'samples', ...p), 'utf8')

const media = new Map(
  ['IMG-20231023.jpg', '00000012-PHOTO-2023-10-23.jpg', 'Café photo.jpg'].map((n) => [
    mediaKey(n),
    { url: `blob:${n}` },
  ]),
)

/* ------------------------------------------------------------ formats */

test('Android: header, sender, text, system line', () => {
  const r = parseWhatsAppChat(
    '23/10/2023, 10:15 - Messages and calls are end-to-end encrypted.\n23/10/2023, 10:16 - Alice: Hello',
  )
  assert.equal(r.meta.format, 'android')
  assert.equal(r.messages.length, 2)
  assert.equal(r.messages[0].sender, null)
  assert.equal(r.messages[1].sender, 'Alice')
  assert.equal(r.messages[1].text, 'Hello')
  assert.equal(r.messages[1].time, '10:16')
  assert.deepEqual(r.participants, ['Alice'])
})

test('iOS: brackets, seconds, LRM marks', () => {
  const r = parseWhatsAppChat(
    '[23/10/23, 10:15:30] Alice: Hi there\n\u200E[23/10/23, 10:16:01] Bob: \u200E<attached: 00000012-PHOTO-2023-10-23.jpg>',
    media,
  )
  assert.equal(r.meta.format, 'ios')
  assert.equal(r.messages.length, 2)
  assert.equal(r.messages[0].time, '10:15')
  assert.equal(r.messages[1].media.url, 'blob:00000012-PHOTO-2023-10-23.jpg')
})

test('mixed formats are reported as mixed', () => {
  const r = parseWhatsAppChat('[23/10/23, 10:15:30] A: x\n23/10/2023, 10:16 - B: y')
  assert.equal(r.meta.format, 'mixed')
  assert.equal(r.messages.length, 2)
})

test('CRLF line endings', () => {
  const r = parseWhatsAppChat('23/10/2023, 10:15 - A: one\r\n23/10/2023, 10:16 - B: two\r\n')
  assert.equal(r.messages.length, 2)
  assert.equal(r.messages[1].text, 'two')
})

test('other separators: dots, dashes, year-first, no comma', () => {
  const r = parseWhatsAppChat(
    '23.10.23, 10:15 - A: dots\n23-10-2023 10:16 - A: dashes\n2023/10/23 10:17 - A: year first\n[2023-10-23 10:18:00] A: iso',
  )
  assert.equal(r.messages.length, 4)
  for (const m of r.messages) {
    assert.equal(m.date.getFullYear(), 2023)
    assert.equal(m.date.getMonth(), 9)
    assert.equal(m.date.getDate(), 23)
  }
})

/* ------------------------------------------------------------ dates */

test('12h clock with narrow NBSP; month-first auto-detection', () => {
  const r = parseWhatsAppChat('12/31/23, 10:15\u202FPM - A: x\n1/2/24, 12:05\u202FAM - B: y')
  assert.equal(r.meta.dateOrder, 'MDY')
  assert.equal(r.messages[0].date.getMonth(), 11)
  assert.equal(r.messages[0].date.getHours(), 22)
  assert.equal(r.messages[0].time, '10:15 PM')
  assert.equal(r.messages[1].date.getMonth(), 0)
  assert.equal(r.messages[1].date.getHours(), 0) // 12:05 AM
})

test('Spanish style "a. m." / "p. m."', () => {
  const r = parseWhatsAppChat('23/10/2023, 10:15 p. m. - A: hola')
  assert.equal(r.messages[0].date.getHours(), 22)
  assert.equal(r.messages[0].time, '10:15 PM')
})

test('ambiguous dates default to day-first', () => {
  const r = parseWhatsAppChat('01/02/2024, 10:00 - A: x')
  assert.equal(r.meta.dateOrder, 'DMY')
  assert.equal(r.messages[0].date.getMonth(), 1)
})

/* ------------------------------------------------------------ messages */

test('multi-line messages (including blank lines)', () => {
  const r = parseWhatsAppChat('23/10/2023, 10:15 - A: line1\nline2\n\nline4\n23/10/2023, 10:16 - B: next')
  assert.equal(r.messages[0].text, 'line1\nline2\n\nline4')
  assert.equal(r.messages[1].text, 'next')
})

test('lines before the first timestamp are ignored and counted', () => {
  const r = parseWhatsAppChat('garbage line\n23/10/2023, 10:15 - A: hi')
  assert.equal(r.messages.length, 1)
  assert.equal(r.meta.skippedLines, 1)
})

test('sender with empty first line (text starts on next line)', () => {
  const r = parseWhatsAppChat('23/10/2023, 10:15 - Alice:\nsecond line')
  assert.equal(r.messages[0].sender, 'Alice')
  assert.equal(r.messages[0].text, 'second line')
})

test('colons in text and times do not break sender split', () => {
  const r = parseWhatsAppChat('23/10/2023, 10:15 - A: meet at 10:30: bring snacks: lots')
  assert.equal(r.messages[0].sender, 'A')
  assert.equal(r.messages[0].text, 'meet at 10:30: bring snacks: lots')
})

test('phone-number senders', () => {
  const r = parseWhatsAppChat('23/10/2023, 10:15 - +49 151 2345678: hi')
  assert.deepEqual(r.participants, ['+49 151 2345678'])
})

test('system messages with quotes/colons are not senders', () => {
  const r = parseWhatsAppChat('23/10/2023, 10:15 - Maya changed the subject to "Trip: Day 1"')
  assert.equal(r.messages[0].sender, null)
  assert.deepEqual(r.participants, [])
})

test('iOS encryption notice (chat name as "sender") becomes a system message', () => {
  const r = parseWhatsAppChat('[23/10/23, 09:58:12] Maya: \u200EMessages and calls are end-to-end encrypted.')
  assert.equal(r.messages[0].sender, null)
  assert.deepEqual(r.participants, [])
})

test('deleted and edited messages', () => {
  const r = parseWhatsAppChat(
    [
      '23/10/2023, 10:15 - A: This message was deleted',
      '23/10/2023, 10:16 - A: You deleted this message',
      '23/10/2023, 10:17 - A: fixed <This message was edited>',
    ].join('\n'),
  )
  assert.equal(r.messages[0].deleted, true)
  assert.equal(r.messages[1].deleted, true)
  assert.equal(r.messages[2].edited, true)
  assert.equal(r.messages[2].text, 'fixed')
})

/* ------------------------------------------------------------ media */

test('Android "(file attached)" with caption', () => {
  const r = parseWhatsAppChat('23/10/2023, 10:16 - Bob: IMG-20231023.jpg (file attached)\nnice caption', media)
  const m = r.messages[0]
  assert.equal(m.media.url, 'blob:IMG-20231023.jpg')
  assert.equal(m.media.kind, 'image')
  assert.equal(m.text, 'nice caption')
})

test('file name matching is case-insensitive and Unicode-normalised', () => {
  const r = parseWhatsAppChat(
    '23/10/2023, 10:16 - Bob: img-20231023.JPG (file attached)\n23/10/2023, 10:17 - Bob: Cafe\u0301 photo.jpg (file attached)',
    media,
  )
  assert.equal(r.messages[0].media.url, 'blob:IMG-20231023.jpg')
  assert.equal(r.messages[1].media.url, 'blob:Café photo.jpg') // NFD in chat, NFC on disk
})

test('file names with spaces', () => {
  const r = parseWhatsAppChat('23/10/2023, 10:16 - B: WhatsApp Image 2023-10-23 at 10.15.30.jpeg (file attached)')
  assert.equal(r.messages[0].media.fileName, 'WhatsApp Image 2023-10-23 at 10.15.30.jpeg')
})

test('missing media keeps file name, url null', () => {
  const r = parseWhatsAppChat('23/10/2023, 10:15 - A: IMG-NOPE.jpg (file attached)', media)
  assert.equal(r.messages[0].media.url, null)
  assert.equal(r.messages[0].media.fileName, 'IMG-NOPE.jpg')
})

test('"<Media omitted>" and friends', () => {
  const r = parseWhatsAppChat(
    ['<Media omitted>', 'image omitted', '<video omitted>', 'sticker omitted'].map(
      (t, i) => `23/10/2023, 10:1${i} - A: ${t}`,
    ).join('\n'),
  )
  for (const m of r.messages) assert.equal(m.media.kind, 'omitted')
})

test('localised attachment markers', () => {
  const r = parseWhatsAppChat('23.10.2023, 10:15 - A: IMG-1.jpg (Datei angehängt)\n23/10/2023, 10:16 - A: IMG-2.jpg (archivo adjunto)')
  assert.equal(r.messages[0].media.fileName, 'IMG-1.jpg')
  assert.equal(r.messages[1].media.fileName, 'IMG-2.jpg')
})

test('kindFromFileName', () => {
  assert.equal(kindFromFileName('IMG-1.JPG'), 'image')
  assert.equal(kindFromFileName('VID-1.mp4'), 'video')
  assert.equal(kindFromFileName('PTT-1.opus'), 'voice')
  assert.equal(kindFromFileName('song.mp3'), 'audio')
  assert.equal(kindFromFileName('STK-1.webp'), 'sticker')
  assert.equal(kindFromFileName('00000001-STICKER-2023.webp'), 'sticker')
  assert.equal(kindFromFileName('photo.webp'), 'image')
  assert.equal(kindFromFileName('Contract.pdf'), 'document')
})

test('searchable index is normalized and includes sender, media and text', () => {
  const r = parseWhatsAppChat(
    '23/10/2023, 10:15 - Héloïse: IMG-2023.jpg (file attached)\nCafé rendezvous!',
    media,
  )
  const m = r.messages[0]
  assert.ok(m._searchable)
  // Diacritics Héloïse -> heloise, Café -> cafe
  assert.ok(m._searchable.includes('heloise'))
  assert.ok(m._searchable.includes('img-2023.jpg'))
  assert.ok(m._searchable.includes('cafe rendezvous'))
})

/* ------------------------------------------------------------ robustness */

test('empty / non-chat input yields no messages instead of throwing', () => {
  assert.equal(parseWhatsAppChat('').messages.length, 0)
  assert.equal(parseWhatsAppChat('just some notes\nnot a chat').messages.length, 0)
})

test('performance: 50k messages parse in a reasonable time', () => {
  const lines = []
  for (let i = 0; i < 50000; i++) lines.push(`23/10/2023, 10:${String(i % 60).padStart(2, '0')} - ${i % 2 ? 'A' : 'B'}: message ${i}`)
  const t = performance.now()
  const r = parseWhatsAppChat(lines.join('\n'))
  assert.equal(r.messages.length, 50000)
  assert.ok(performance.now() - t < 3000, 'parsing took too long')
})

/* ------------------------------------------------------------ bundled samples */

test('bundled samples parse as documented', () => {
  const android = parseWhatsAppChat(sample('android', '_chat.txt'))
  assert.equal(android.meta.format, 'android')
  assert.deepEqual(android.participants, ['Maya', 'You'])

  const ios = parseWhatsAppChat(sample('ios', '_chat.txt'))
  assert.equal(ios.meta.format, 'ios')
  assert.deepEqual(ios.participants, ['Maya', 'Alex'])
  assert.equal(ios.messages[0].sender, null) // encryption notice

  const us = parseWhatsAppChat(sample('us-12h', '_chat.txt'))
  assert.equal(us.meta.dateOrder, 'MDY')

  const group = parseWhatsAppChat(sample('group', 'WhatsApp Chat - Weekend Hikers.txt'))
  assert.equal(group.participants.length, 4)

  const edge = parseWhatsAppChat(sample('edge-cases', '_chat.txt'))
  assert.ok(edge.messages.some((m) => m.deleted))
  assert.ok(edge.messages.some((m) => m.edited))
  assert.ok(edge.messages.some((m) => m.media?.kind === 'sticker'))
  assert.ok(edge.messages.some((m) => m.media?.kind === 'voice'))
  assert.ok(edge.messages.some((m) => m.media?.kind === 'document'))
})

test('security: media filenames strip path traversal and control characters', () => {
  const mediaMap = new Map([
    ['photo.jpg', { url: 'blob:safe-photo' }]
  ])
  const maliciousAndroid = '23/10/2023, 10:15 - Maya: ../../../etc/photo.jpg (file attached)'
  const r1 = parseWhatsAppChat(maliciousAndroid, mediaMap)
  assert.equal(r1.messages[0].media.fileName, 'photo.jpg')
  assert.equal(r1.messages[0].media.url, 'blob:safe-photo')

  const maliciousIos = '[23/10/23, 10:15:30] Maya: <attached: ..\\..\\secret\\photo.jpg>'
  const r2 = parseWhatsAppChat(maliciousIos, mediaMap)
  assert.equal(r2.messages[0].media.fileName, 'photo.jpg')
  assert.equal(r2.messages[0].media.url, 'blob:safe-photo')
})

test('types: validateParseResult verifies schema contracts', async () => {
  const { validateParseResult } = await import('../src/types.js')
  const valid = parseWhatsAppChat('23/10/2023, 10:15 - Maya: Hello!')
  assert.equal(validateParseResult(valid).valid, true)

  const invalid = { messages: 'not-an-array' }
  const res = validateParseResult(invalid)
  assert.equal(res.valid, false)
  assert.ok(res.errors.length > 0)
})

