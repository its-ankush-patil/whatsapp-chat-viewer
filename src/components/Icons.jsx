/* Small inline SVG icon set (inline so html2canvas can rasterise them) */

const base = { xmlns: 'http://www.w3.org/2000/svg', fill: 'currentColor' }

export const BackIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
)

export const VideoIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
)

export const CallIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="22" height="22" {...p}>
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
  </svg>
)

export const MoreIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
  </svg>
)

export const SmileIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-3.5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
)

export const ClipIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path d="M16.5 6v11.5a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 0 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 0 0 11 0V6h-1.5z" />
  </svg>
)

export const CameraIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path
      fillRule="evenodd"
      d="M9 3 7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
    />
    <circle cx="12" cy="13" r="3.2" />
  </svg>
)

export const MicIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
  </svg>
)

export const PersonIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2.25c-3.01 0-9 1.51-9 4.5V21h18v-2.25c0-2.99-5.99-4.5-9-4.5z" />
  </svg>
)

export const GroupIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05A4.2 4.2 0 0 1 17 16.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
)

/** Single / double tick. `read` => blue ticks */
export const Ticks = ({ className = '' }) => (
  <svg viewBox="0 0 16 11" width="16" height="11" className={className} fill="currentColor">
    <path d="M11.07.65 4.9 8.62 2.43 6.15a.6.6 0 1 0-.85.85l2.95 2.95a.6.6 0 0 0 .9-.06L11.98 1.4A.6.6 0 1 0 11.07.65z" />
    <path d="M15.07.65 8.9 8.62l-.58-.58-.8 1.02 1 1a.6.6 0 0 0 .9-.06L15.98 1.4a.6.6 0 1 0-.91-.75z" />
  </svg>
)

export const FileIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="28" height="28" {...p}>
    <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5z" />
  </svg>
)

export const LockIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="12" height="12" {...p}>
    <path d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9V6z" />
  </svg>
)

export const ImageOffIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="30" height="30" {...p}>
    <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" />
  </svg>
)

export const SearchIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="22" height="22" {...p}>
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
)

export const ChevronUpIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="20" height="20" {...p}>
    <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
  </svg>
)

export const ChevronDownIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="20" height="20" {...p}>
    <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
)

export const CloseIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="20" height="20" {...p}>
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
)

export const BookIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="20" height="20" {...p}>
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
  </svg>
)

export const CopyIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

export const CheckIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const InfoIcon = (p) => (
  <svg {...base} viewBox="0 0 24 24" width="18" height="18" {...p}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
)


