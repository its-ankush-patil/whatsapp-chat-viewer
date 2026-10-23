import { useState } from 'react'
import { FileIcon, ImageOffIcon } from '../Icons'

export function Placeholder({ icon, title, note }) {
  return (
    <div className="flex min-w-[200px] items-center gap-3 rounded-md bg-wa-overlay p-3 text-wa-meta">
      {icon}
      <div className="min-w-0 leading-tight">
        <div className="truncate text-[13px] text-wa-text">{title}</div>
        <div className="text-[11.5px]">{note}</div>
      </div>
    </div>
  )
}

export function MediaImage({ media, onLoad, className }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <Placeholder
        icon={<ImageOffIcon />}
        title={media.fileName}
        note="Preview not supported by this browser (e.g. HEIC)"
      />
    )
  }
  return (
    <img
      src={media.url}
      alt={media.fileName}
      onLoad={onLoad}
      onError={() => setFailed(true)}
      decoding="async"
      className={className}
    />
  )
}

export function MediaBlock({ media, onLoad }) {
  const { kind, url, fileName } = media

  if (kind === 'omitted') {
    return <p className="px-1 py-1 text-[13.5px] text-wa-meta italic">🚫 Media omitted</p>
  }

  if (!url) {
    return (
      <Placeholder
        icon={kind === 'image' ? <ImageOffIcon /> : <FileIcon />}
        title={fileName}
        note="File not uploaded"
      />
    )
  }

  if (kind === 'image') {
    return (
      <MediaImage
        media={media}
        onLoad={onLoad}
        className="block max-h-[380px] w-full rounded-md object-cover"
      />
    )
  }
  if (kind === 'video') {
    return (
      <video
        src={url}
        controls
        preload="metadata"
        onLoadedMetadata={onLoad}
        className="block max-h-[380px] w-full rounded-md bg-black"
      />
    )
  }
  if (kind === 'audio' || kind === 'voice') {
    return (
      <div>
        {kind === 'voice' && <div className="px-1 pb-0.5 text-[12px] text-wa-meta">🎤 Voice message</div>}
        <audio src={url} controls preload="metadata" className="h-10 w-[240px] max-w-full" />
      </div>
    )
  }

  return (
    <a href={url} download={fileName} className="flex items-center gap-3 rounded-md bg-wa-overlay p-3 text-wa-text">
      <FileIcon className="text-wa-meta" />
      <span className="truncate text-[13px]">{fileName}</span>
    </a>
  )
}
