import { CameraIcon, ClipIcon, MicIcon, SmileIcon } from './Icons'

/** Decorative message composer, purely visual (makes screenshots look native) */
export default function ChatFooter({ mobile }) {
  return (
    <footer className={`shrink-0 px-1.5 pt-1.5 ${mobile ? 'pb-1' : 'pb-1.5'}`}>
      <div className="flex items-end gap-1.5">
        <div className="flex min-h-[46px] flex-1 items-center gap-3 rounded-full bg-wa-composer px-3 text-wa-meta shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
          <SmileIcon />
          <span className="flex-1 font-wa text-[16px]">Message</span>
          <ClipIcon className="-rotate-45" />
          <CameraIcon />
        </div>
        <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-wa-mic text-white shadow">
          <MicIcon />
        </div>
      </div>
      {mobile && <div className="mx-auto mt-2 mb-1 h-[5px] w-[134px] rounded-full bg-wa-text opacity-80" />}
    </footer>
  )
}
