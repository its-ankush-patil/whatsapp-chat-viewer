import ChatBody from './ChatBody'
import { ChatHeader } from './ChatHeader'
import ChatFooter from './ChatFooter'
import { THEMES } from '../lib/themes'

/**
 * The WhatsApp replica. `frameRef` points at the outer element so the
 * screenshot function captures exactly what the user sees (incl. phone bezel).
 *
 * Mobile View => exactly 393 x 852 px (iPhone 14/15) with a black bezel.
 * (box-sizing is border-box, so the border is *included* in those dimensions.)
 */
export default function ChatWindow({
  frameRef,
  mobile,
  theme = 'light',
  contactName,
  subtitle,
  isGroup,
  messages,
  me,
  searchOpen,
  searchQuery,
  matchCount,
  activeMatchNumber,
  onSearchOpen,
  onSearchClose,
  onSearchChange,
  onNextMatch,
  onPrevMatch,
  activeMessageId,
}) {
  const frameClasses = mobile
    ? 'h-[852px] w-[393px] shrink-0 rounded-[56px] border-[10px] border-black'
    : 'h-[calc(100vh-260px)] min-h-[520px] w-full max-w-[760px] rounded-2xl border border-white/10'

  return (
    <div
      id="chat-frame"
      ref={frameRef}
      className={`${THEMES[theme].className} ${frameClasses} flex flex-col overflow-hidden bg-wa-wallpaper font-wa shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] transition-[width,height,border-radius] duration-300`}
    >
      <ChatHeader
        name={contactName}
        subtitle={subtitle}
        isGroup={isGroup}
        mobile={mobile}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        matchCount={matchCount}
        activeMatchNumber={activeMatchNumber}
        onSearchOpen={onSearchOpen}
        onSearchClose={onSearchClose}
        onSearchChange={onSearchChange}
        onNextMatch={onNextMatch}
        onPrevMatch={onPrevMatch}
      />
      <div className="wa-wallpaper flex min-h-0 flex-1 flex-col">
        <ChatBody
          messages={messages}
          me={me}
          isGroup={isGroup}
          theme={theme}
          searchQuery={searchQuery}
          activeMessageId={activeMessageId}
        />
        <ChatFooter mobile={mobile} />
      </div>
    </div>
  )
}
