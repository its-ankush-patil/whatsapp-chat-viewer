# Sample WhatsApp Chat Exports

This directory contains pre-configured test chats demonstrating all supported formats, regional variations, and edge cases. You can drop these files directly into the web application to test various behaviors.

---

## Sample Directory Overview

| Directory | Format / Focus | Highlights |
| --- | --- | --- |
| **`samples/android/`** | Android 24-hour DD/MM | Standard Android format with hyphens (` - `), attachment markers `(file attached)`, multi-line notes, and system notices. |
| **`samples/ios/`** | iOS timestamp bracketed | Standard iOS format with `[...]`, seconds (`:ss`), `<attached: ...>` markers, and invisible directional LRM tags. |
| **`samples/us-12h/`** | US 12-hour clock (AM/PM) | Month-first date format (`MM/DD/YY`), narrow non-breaking spaces before AM/PM, and midnight/noon roll-over. |
| **`samples/group/`** | Group Chat (Multi-user) | 4+ distinct participants, dynamic color assignment for sender names, group creation and description change notices. |
| **`samples/edge-cases/`** | Edge Cases & Special States | Deleted messages (`This message was deleted`), edited tags (`<This message was edited>`), un-uploaded file placeholders, stickers, and documents. |

---

## How to Test with These Samples

1. Start the dev server (`npm run dev`) and navigate to `http://localhost:5173`.
2. In your file explorer, open any sample directory (e.g. `samples/android/`).
3. Select `_chat.txt` and drag it onto the viewer drop zone.
4. (Optional) To view images with the sample chat, also drag along the sample images from `public/sample/`.
