/**
 * Embedded documentation data extracted from project guides, specifications, and architecture.
 * Fully searchable with categories, keywords, actionable instructions, and code snippets.
 */

export const DOC_CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: '✨' },
  { id: 'export', label: 'Export Guides', icon: '📱' },
  { id: 'search', label: 'Search & Shortcuts', icon: '🔍' },
  { id: 'formats', label: 'Supported Formats', icon: '📄' },
  { id: 'media', label: 'Media & Attachments', icon: '🖼️' },
  { id: 'troubleshoot', label: 'Troubleshooting', icon: '🛠️' },
  { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
]

export const DOC_ARTICLES = [
  {
    id: 'export-ios',
    category: 'export',
    title: 'Exporting WhatsApp Chat on iPhone (iOS)',
    summary: 'How to export a complete conversation with photos and videos on iPhone.',
    badge: 'iOS / iPhone',
    keywords: ['iphone', 'ios', 'export', 'apple', 'share', 'zip', '_chat.txt', 'airdrop', 'files'],
    content: `
### Step-by-Step iOS Export:
1. Open **WhatsApp** on your iPhone and go to the conversation you want to export.
2. Tap the **Contact Name** or **Group Name** at the very top of the chat.
3. Scroll down to the bottom and tap **Export Chat**.
4. Choose **Attach Media** (to include photos/videos) or **Without Media** (for fast text-only export).
5. When the iOS Share sheet opens:
   - Select **Save to Files**, or
   - **AirDrop** / **Email** the resulting \`.zip\` archive to your computer.
6. **Unzip** the downloaded archive on your computer. You will see:
   - \`_chat.txt\` (the messages text file)
   - Media files named like \`00000012-PHOTO-2023-10-23.jpg\`
7. Drag & drop the unzipped folder (or \`_chat.txt\` with all images) directly into this viewer!
    `,
    tip: 'WhatsApp limits iOS exports with media to approximately 10,000 messages (and 40,000 messages without media).',
    example: '[23/10/23, 10:15:30] Maya: Hey! Did you see the photos?\n[23/10/23, 10:16:05] You: Yes, they look amazing!',
  },
  {
    id: 'export-android',
    category: 'export',
    title: 'Exporting WhatsApp Chat on Android',
    summary: 'How to export chat history and media from any Android phone.',
    badge: 'Android',
    keywords: ['android', 'samsung', 'google', 'pixel', 'export', 'zip', 'txt', 'drive', 'photos'],
    content: `
### Step-by-Step Android Export:
1. Open **WhatsApp** on your Android device and open the chat.
2. Tap the **three dots (⋮)** in the top right corner.
3. Tap **More** → **Export chat**.
4. Choose **Include media** (recommended) or **Without media**.
5. Save or share the resulting \`.zip\` archive (Google Drive, Gmail, or local storage).
6. Transfer the \`.zip\` to your computer and **extract/unzip** it.
7. You will get a file named \`WhatsApp Chat with <Name>.txt\` alongside photos (\`IMG-...\`), videos (\`VID-...\`), and voice notes (\`PTT-...\`).
8. Drop the unzipped folder into the viewer.
    `,
    tip: 'Android export files start with "WhatsApp Chat with..." and use hyphen-separated timestamps.',
    example: '23/10/2023, 10:15 - Maya: Hey! Did you see the photos?\n23/10/2023, 10:16 - You: Looking right now!',
  },
  {
    id: 'loading-files',
    category: 'export',
    title: 'Loading Chats and Missing Media',
    summary: 'Four flexible ways to load chats, add missing photos, or inspect sample archives.',
    badge: 'Getting Started',
    keywords: ['drop', 'drag', 'folder', 'upload', 'load', 'sample', 'missing', 'media', 'add'],
    content: `
### Loading Options:
- **Drag & Drop Folder**: Drag the entire unzipped folder anywhere on the screen. The viewer automatically extracts the chat and maps all media files.
- **Drag & Drop Files**: Select \`_chat.txt\` and photos/videos together in your file explorer and drop them.
- **Choose Files / Folder**: Use the file picker buttons on the landing page.
- **+ Add Files**: If some photos were omitted or loaded later, click **+ Add files** in the toolbar or drop more files at any time to link them automatically.
- **Try a sample chat**: Click "Try a sample chat" on the landing page to instantly test with bundled conversations and photos.
    `,
    tip: 'Files like .DS_Store or Thumbs.db are automatically ignored.',
  },
  {
    id: 'in-chat-search',
    category: 'search',
    title: 'In-Chat Full-Text Search Engine',
    summary: 'Fast O(1) in-chat search with diacritic folding, match counters, and auto-scrolling.',
    badge: 'Pro Feature',
    keywords: ['search', 'find', 'ctrl+f', 'cmd+f', 'highlight', 'next', 'previous', 'diacritics', 'index'],
    content: `
### How to Use In-Chat Search:
- Press **Ctrl+F** (or **Cmd+F** on Mac), or click **🔍 Search** in the header or toolbar.
- The header transforms into an integrated search bar with a live match counter (\`"1 of 8"\`).
- **Accent & Diacritic Insensitive**: Searching for \`cafe\` matches \`café\`, \`uber\` matches \`über\`, and symbols are normalized.
- **Navigation**:
  - Press **Enter** to jump to the next matching message.
  - Press **Shift + Enter** to jump to the previous matching match.
  - Press **Esc** or click the Back arrow to close search.
- **Viewport Auto-Expansion**: If a match is in an older, unrendered part of a large chat (50k+ messages), the viewport automatically expands and smoothly centers the target message.
    `,
    tip: 'Search works across sender names, text messages, system notices, and media file captions.',
  },
  {
    id: 'keyboard-shortcuts',
    category: 'search',
    title: 'Keyboard Shortcuts Cheatsheet',
    summary: 'Quick keyboard commands to navigate, search, and capture without touching the mouse.',
    badge: 'Shortcuts',
    keywords: ['keyboard', 'shortcuts', 'hotkeys', 'enter', 'esc', 'ctrl+f', 'cmd+f', 'help', '?'],
    content: `
### Global & Chat Shortcuts:
| Shortcut | Action |
| --- | --- |
| **Ctrl + F** / **Cmd + F** | Open in-chat search |
| **Enter** | Jump to next search match |
| **Shift + Enter** | Jump to previous search match |
| **Esc** | Close search / Close Documentation modal |
| **?** (Question mark) | Open this Documentation & Help Center |
| **Ctrl + Shift + S** | Download screenshot |
    `,
    tip: 'Pressing Escape instantly dismisses modals and search bars.',
  },
  {
    id: 'supported-formats',
    category: 'formats',
    title: 'Supported Timestamp & Line Formats',
    summary: 'Full specification of supported Android, iOS, 12h/24h, and global date notations.',
    badge: 'Specifications',
    keywords: ['formats', 'dates', 'dmy', 'mdy', 'brackets', 'hyphen', 'am/pm', '24h', 'regex', 'timestamp'],
    content: `
### Supported Syntax by Platform:
- **Android**: \`DD/MM/YYYY, HH:mm - Sender: Message\`
  - *Example*: \`23/10/2023, 10:15 - Maya: Hello!\`
- **iOS (iPhone)**: \`[DD/MM/YY, HH:mm:ss] Sender: Message\`
  - *Example*: \`[23/10/23, 10:15:30] Maya: Hello!\`

### Date Order Detection (DMY vs MDY):
- The parser analyzes all message timestamps across the entire export.
- If any day exceeds 12 (e.g. \`23/10/2023\`), it is conclusively determined to be **Day/Month/Year (DMY)**.
- If any month exceeds 12 (e.g. \`10/23/2023\`), it is conclusively **Month/Day/Year (MDY)**.
- Ambiguous dates default to DMY (global standard).

### Time Formats:
- **24-Hour**: \`14:30\`, \`09:15:42\`, \`14.30\`
- **12-Hour with AM/PM**: \`2:30 PM\`, \`09:15 AM\`, \`10:15pm\`
- **Regional Variations**: Handles Spanish \`a. m. / p. m.\` and Unicode narrow non-breaking spaces (\`\\u202F\`).
    `,
    example: 'Android: 23/10/2023, 10:15 - Alex: Hello!\niOS: [23/10/23, 10:15:30] Alex: Hello!',
  },
  {
    id: 'media-attachments',
    category: 'media',
    title: 'Photos, Videos, Voice Notes & Documents',
    summary: 'How media files are recognized, matched, and rendered inside message bubbles.',
    badge: 'Attachments',
    keywords: ['media', 'photos', 'images', 'jpg', 'png', 'video', 'mp4', 'audio', 'voice', 'opus', 'pdf'],
    content: `
### Supported File Types:
- **Images**: \`.jpg\`, \`.jpeg\`, \`.png\`, \`.webp\`, \`.gif\` (interactive zoom and full preview)
- **Videos**: \`.mp4\`, \`.mov\`, \`.webm\` (embedded browser video player)
- **Voice Notes & Audio**: \`.opus\`, \`.ogg\`, \`.mp3\`, \`.m4a\`, \`.aac\`, \`.wav\` (WhatsApp-style audio player pill)
- **Documents**: \`.pdf\`, \`.doc\`, \`.zip\`, \`.txt\` (clean document icon with file name & size)

### Attachment Line Notations in .txt:
- **Android**: \`<filename> (file attached)\`
- **iOS**: \`<attached: <filename>>\`
- **Localised**: Supports Spanish, French, German, Portuguese, Italian, and Dutch attachment strings.
- **Omitted Media**: Shows a clean informative badge if exported without media.
    `,
    tip: 'Missing media files show a clean placeholder with the filename instead of broken image boxes.',
  },
  {
    id: 'screenshot-tips',
    category: 'search',
    title: 'Capturing Beautiful Screenshots',
    summary: 'Tips for getting high-fidelity screenshots in Desktop or iPhone Mobile frames.',
    badge: 'Sharing',
    keywords: ['screenshot', 'capture', 'png', 'download', 'mobile', 'retina', 'export', 'frame'],
    content: `
### How to Take the Perfect Chat Screenshot:
1. **Choose Your View**:
   - **Desktop View**: Wide window layout, ideal for documentation or reading long threads.
   - **Mobile View**: Exact **393 × 852 px** authentic iPhone frame with bezel, Dynamic Island, and status bar.
2. **Select Theme**: Toggle between **Light** (classic WhatsApp green & beige) and **Dark** (slate & deep emerald).
3. **Customize Chat Name**: Type a custom name in the **Chat name** field (e.g. "Maya" or "Project Team").
4. **Filter Dates**: Use the date range picker to isolate just the messages you need.
5. **Set "I am"**: Use the "I am" selector to choose which side of the conversation is yours (green outgoing on right).
6. Click **⬇ Download Screenshot** to download a high-res PNG!
    `,
    tip: 'The screenshot captures the currently visible scroll position within the chat frame.',
  },
  {
    id: 'troubleshooting-common',
    category: 'troubleshoot',
    title: 'Troubleshooting & Common Issues',
    summary: 'Fixes for "No messages recognised", missing media, or unexpected formatting.',
    badge: 'Support',
    keywords: ['error', 'troubleshoot', 'empty', 'no messages', 'corrupt', 'fix', 'encoding', 'utf8'],
    content: `
### Common Issues & Quick Fixes:

#### 1. "No messages were recognised in your file"
- Ensure you dropped the raw file exported by WhatsApp (usually \`_chat.txt\` or \`WhatsApp Chat with <Name>.txt\`).
- If you opened and re-saved the text file in a text editor (like Word or Notepad), line breaks or quotes may have been altered. Use the original file from the zip archive.

#### 2. "Attachment missing: File not uploaded"
- The chat text references a photo, but that photo wasn't included in the files dropped.
- Click **+ Add files** in the toolbar and select the missing images, or drop the entire unzipped folder.

#### 3. Corrupted or Missing Emoji
- WhatsApp exports are UTF-8 encoded. The parser automatically sanitizes byte order marks (BOM) and zero-width directional marks.
    `,
    tip: 'If in doubt, reset and drop the entire unzipped folder at once.',
  },
  {
    id: 'privacy-model',
    category: 'privacy',
    title: '100% Client-Side Privacy Guarantee',
    summary: 'Detailed explanation of our zero-cloud architecture and memory safety.',
    badge: 'Security',
    keywords: ['privacy', 'security', 'client-side', 'zero-cloud', 'local', 'offline', 'blob', 'data'],
    content: `
### How Your Privacy is Guaranteed:
- **Zero Server Uploads**: The entire application runs exclusively inside your web browser. There is no backend server receiving your chat history or photos.
- **Offline Capable**: Once the web page is loaded, you can even disconnect from Wi-Fi/Internet completely and the parser, search, and screenshot tools will function 100%.
- **Automatic Memory Cleanup**: When you reset the chat or close the tab, all created \`blob:\` memory URLs are immediately revoked to protect against memory leaks.
- **Open Source**: The complete code is transparent and auditable.
    `,
    tip: 'Your private chats and personal photos never leave your device.',
  },
]
