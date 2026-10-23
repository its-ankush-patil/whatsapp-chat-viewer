# Changelog

All notable changes to the WhatsApp Chat Viewer project will be documented in this file.

## [1.1.0] - 2026-10-23

### Added
- **In-Chat Search Engine**:
  - Full-text instant search with diacritic and accent folding (`café` matches `cafe`).
  - Integrated header search bar with live match counter (`1 of N`) and input clear button.
  - Keyboard navigation: <kbd>Ctrl+F</kbd> / <kbd>Cmd+F</kbd> to activate, <kbd>Enter</kbd> / <kbd>Shift+Enter</kbd> to cycle matches, <kbd>Esc</kbd> to dismiss.
  - Viewport auto-expansion smoothly scrolling older windowed messages into view.
- **Embedded In-App Documentation & Help Center**:
  - Real-time searchable documentation modal (<kbd>?</kbd>) with spotlight search input.
  - Structured step-by-step export timelines for iOS and Android with circular step badges and connecting tracks.
  - Category filters: All, Export Guides, Search & Shortcuts, Supported Formats, Media, Troubleshooting, and Privacy.
  - 1-click syntax copy buttons with interactive checkmark feedback.
- **Apple Designer Polish & Hardware Framing**:
  - SF Pro system typography with tuned tracking and micro-haptics.
  - Authentic iPhone 15/16 Pro Dynamic Island and status bar geometry.
  - Apple segmented pill switches for Light/Dark themes.

### Optimized
- **High-Performance Screenshot Engine**:
  - Off-screen element culling (`ignoreElements`) skipping scrolled-out DOM subtrees during capture, reducing rasterization overhead by ~95%.
  - Asynchronous native `canvas.toBlob()` serialization eliminating main-thread freezes.
- **Streamlined Studio Control Ribbon**:
  - Consolidated status badge preventing layout shifts and awkward vertical text wrapping.
  - Collapsible options ribbon with clean inline selectors for sender, theme, custom name, and date filters.

## [1.0.0] - 2026-10-23

### Added
- **Core Parser Engine**:
  - Full support for Android (`DD/MM/YYYY, HH:mm - Sender: Message`) and iOS (`[DD/MM/YY, HH:mm:ss] Sender: Message`) formats.
  - Multi-line message continuation parsing with preservation of internal blank lines and bullet points.
  - Media marker extraction for `(file attached)` and `<attached: ...>`.
  - Case-insensitive and Unicode-normalized (NFC/NFD) media filename matching.
  - Automated `DMY` vs `MDY` date ordering detection and 12h/24h time support.
  - Deleted message identification (`This message was deleted` / `You deleted this message`).
  - Edited message badge support (`<This message was edited>`).
  - System encryption notices and group administration events recognition.
- **WhatsApp Replica Interface**:
  - Authentic doodle wallpaper pattern on solid background (`#E5DDD5` light, `#0B141A` dark).
  - Accurate bubble geometries with SVG tails (`#DCF8C6` outgoing, `#FFFFFF` incoming).
  - Blue double-tick delivery indicators and formatted timestamps inside bubbles.
  - Distinct sender colors for multi-participant group chats.
  - Integrated contact header with avatar placeholders and call buttons.
  - Decorative bottom composer and iOS status bar for mobile framing.
- **Mobile View & Export Tools**:
  - One-click "Toggle Mobile View" constraining layout to exact iPhone dimensions (393px × 852px).
  - "Download Screenshot" generating 2× retina PNGs via `html2canvas-pro`.
  - Date range filters to isolate conversations by timeframe.
  - "I am" selector to switch perspective of sent vs. received messages.
  - Customizable contact display name override.
- **Test & Validation Suite**:
  - 26 unit tests covering parsing variations, edge cases, and 50k-message benchmarks.
  - End-to-end browser test script verifying real layout, colors, and PNG downloads.
  - Automated screenshot capture script for documentation assets.
