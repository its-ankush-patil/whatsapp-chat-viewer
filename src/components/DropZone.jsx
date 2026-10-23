import { useRef } from 'react'
import { BookIcon } from './Icons'

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
)

/**
 * Apple-grade landing drop zone.
 */
export default function DropZone({ isDragging, onFiles, onSample, error, onOpenDocs }) {
  const fileInput = useRef(null)
  const folderInput = useRef(null)

  const pick = (e) => {
    if (e.target.files?.length) onFiles(Array.from(e.target.files))
    e.target.value = '' // allow re-picking the same files
  }

  return (
    <section
      id="drop-zone"
      aria-label="Upload your WhatsApp chat export"
      className={`wa-pop relative w-full max-w-2xl overflow-hidden rounded-[32px] border p-8 text-center backdrop-blur-2xl transition-all duration-300 sm:p-12 ${
        isDragging
          ? 'scale-[1.02] border-wa-green/80 bg-wa-green/[0.08] shadow-[0_0_90px_-10px_rgba(37,211,102,0.45)] ring-2 ring-wa-green/30'
          : 'border-white/10 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:border-white/20 hover:bg-white/[0.04]'
      }`}
    >
      {/* Decorative ambient light behind icon */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-32 w-32 rounded-full bg-wa-green/10 blur-2xl" />

      {/* Upload Icon Container */}
      <div
        className={`relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border transition-all duration-300 ${
          isDragging
            ? 'scale-110 border-wa-green bg-wa-green text-[#06281a] shadow-[0_0_30px_rgba(37,211,102,0.5)]'
            : 'border-white/10 bg-white/[0.05] text-wa-green shadow-inner'
        }`}
      >
        <UploadIcon />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {isDragging ? 'Release to load your chat' : 'Drop your WhatsApp export here'}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60">
        Drop <code className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 text-xs font-mono text-white/90">_chat.txt</code> alongside
        photos and audio, or drop the whole unzipped folder.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          id="btn-choose-files"
          type="button"
          onClick={() => fileInput.current?.click()}
          className="rounded-full bg-linear-to-b from-[#28e36e] to-[#1eb857] px-6 py-2.5 text-sm font-semibold text-[#042013] shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition-all hover:brightness-110 active:scale-95"
        >
          Choose files
        </button>
        <button
          id="btn-choose-folder"
          type="button"
          onClick={() => folderInput.current?.click()}
          className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/25 active:scale-95"
        >
          Choose folder
        </button>
        <button
          id="btn-sample"
          type="button"
          onClick={onSample}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white/60 transition-all hover:text-white"
        >
          <span>Try a sample chat</span>
          <span className="text-xs text-white/40">→</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-6 mx-auto max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* Quick link to Documentation & Privacy */}
      <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs text-white/40">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-wa-green" /> 100% private: runs locally in your browser
        </span>

        <button
          id="btn-dropzone-docs"
          type="button"
          onClick={onOpenDocs}
          className="inline-flex items-center gap-1 text-white/50 transition hover:text-wa-green hover:underline underline-offset-2"
        >
          <BookIcon width={13} height={13} />
          <span>Documentation & Export Guide</span>
        </button>
      </div>

      <input ref={fileInput} type="file" multiple hidden onChange={pick} />
      <input ref={folderInput} type="file" hidden onChange={pick} webkitdirectory="" directory="" multiple />
    </section>
  )
}
