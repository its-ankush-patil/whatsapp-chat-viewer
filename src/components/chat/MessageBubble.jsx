import { formatText } from '../../lib/formatText'
import { LockIcon } from '../Icons'
import { Meta, Tail } from './BubbleMeta'
import { MediaBlock, MediaImage } from './MediaAttachment'

const NAME_COLORS = ['#1f7aec', '#e542a3', '#fa6533', '#06a884', '#a55eea', '#b7791f', '#5b8c00', '#d4315b']

const colorFor = (name = '') => {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return NAME_COLORS[h % NAME_COLORS.length]
}

export function StickerMessage({ msg, outgoing, onMediaLoad, showTail, isCurrentMatch }) {
  return (
    <div
      id={`msg-${msg.id}`}
      className={`flex px-3 sm:px-[6%] transition-all duration-300 ${outgoing ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-2' : 'mt-[2px]'}`}
    >
      <div
        className={`relative rounded-xl transition-shadow duration-300 ${
          isCurrentMatch ? 'ring-3 ring-[#ff9800] shadow-[0_0_16px_rgba(255,152,0,0.5)]' : ''
        }`}
      >
        <MediaImage
          media={msg.media}
          onLoad={onMediaLoad}
          className="block h-[150px] w-[150px] object-contain"
        />
        <Meta time={msg.time} outgoing={outgoing} overlay className="absolute right-1 bottom-0 rounded-full bg-black/35 px-1.5" />
      </div>
    </div>
  )
}

export function DayChip({ label }) {
  return (
    <div className="my-2 flex justify-center">
      <span className="rounded-lg bg-wa-chip px-3 py-[5px] font-wa text-[12.5px] text-wa-system shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
        {label}
      </span>
    </div>
  )
}

export function SystemMessage({ text, searchQuery, isCurrentMatch }) {
  const encrypted = /end-to-end encrypted/i.test(text)
  return (
    <div className="my-1.5 flex justify-center px-6">
      <span
        className={`max-w-[90%] rounded-lg px-3 py-[5px] text-center font-wa text-[12.5px] leading-[17px] whitespace-pre-wrap text-wa-system shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
          encrypted ? 'bg-wa-notice' : 'bg-wa-chip'
        }`}
      >
        {encrypted && <LockIcon className="mr-1 mb-0.5 inline" />}
        {formatText(text, searchQuery, isCurrentMatch)}
      </span>
    </div>
  )
}

export function Bubble({ msg, outgoing, showTail, senderLabel, fills, onMediaLoad, searchQuery, isCurrentMatch }) {
  if (msg.media?.kind === 'sticker' && msg.media.url) {
    return (
      <StickerMessage
        msg={msg}
        outgoing={outgoing}
        showTail={showTail}
        onMediaLoad={onMediaLoad}
        isCurrentMatch={isCurrentMatch}
      />
    )
  }

  const hasVisual = msg.media && (msg.media.kind === 'image' || msg.media.kind === 'video') && msg.media.url
  const captionless = hasVisual && !msg.text

  return (
    <div
      id={`msg-${msg.id}`}
      className={`flex px-3 sm:px-[6%] transition-all duration-300 ${outgoing ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-2' : 'mt-[2px]'}`}
    >
      <div
        className={`relative max-w-[82%] rounded-lg shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] transition-all duration-300 sm:max-w-[70%] ${
          outgoing ? 'bg-wa-out' : 'bg-wa-in'
        } ${isCurrentMatch ? 'ring-2 ring-[#ff9800] shadow-[0_0_14px_rgba(255,152,0,0.5)]' : ''} ${
          showTail ? (outgoing ? 'rounded-tr-none' : 'rounded-tl-none') : ''
        } ${msg.media ? 'p-[3px]' : 'px-[7px] pt-[5px] pb-[6px]'} ${hasVisual ? 'w-[min(82%,330px)]' : ''}`}
      >
        {showTail && <Tail outgoing={outgoing} fills={fills} />}

        {senderLabel && (
          <div
            className="px-1 pt-0.5 text-[12.8px] leading-[18px] font-medium"
            style={{ color: colorFor(msg.sender) }}
          >
            {formatText(msg.sender, searchQuery, isCurrentMatch)}
          </div>
        )}

        {msg.media && (
          <div className="relative">
            <MediaBlock media={msg.media} onLoad={onMediaLoad} />
            {captionless && (
              <div
                className="pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-md px-2 pt-6 pb-1"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0))' }}
              >
                <Meta time={msg.time} outgoing={outgoing} edited={msg.edited} overlay className="justify-end" />
              </div>
            )}
          </div>
        )}

        {(msg.text || !msg.media) && (
          <div
            className={`font-wa text-[14.2px] leading-[19px] break-words whitespace-pre-wrap text-wa-text ${
              msg.media ? 'px-1 pt-1 pb-0.5' : ''
            } ${msg.deleted ? 'text-wa-meta italic' : ''}`}
          >
            {msg.deleted ? `🚫 ${msg.text.replace(/^🚫\s*/, '')}` : formatText(msg.text, searchQuery, isCurrentMatch)}
            <Meta
              time={msg.time}
              outgoing={outgoing}
              edited={msg.edited}
              className="float-right mt-[7px] -mb-[3px] ml-2"
            />
          </div>
        )}
        {msg.media && !msg.text && !captionless && (
          <div className="flex justify-end px-1 pb-0.5">
            <Meta time={msg.time} outgoing={outgoing} edited={msg.edited} />
          </div>
        )}
      </div>
    </div>
  )
}
