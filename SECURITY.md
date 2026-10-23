# Security Policy

The WhatsApp Chat Viewer project takes the security and privacy of our users seriously. Because this application processes personal chat archives, conversations, and media files, it operates under a strict **100% client-side privacy model**.

---

## 1. Supported Versions

Security updates are actively applied to the following release branches:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |
| < 1.0   | :x:                |

---

## 2. Core Security & Privacy Guarantees

- **Zero Server Uploads**: No message text, attachment, metadata, or diagnostic metric is transmitted to any remote server or third-party service.
- **Local Sandbox Execution**: All file ingestion is handled via the browser's native `File` and `Blob` APIs.
- **Strict Protocol Sanitization**: Any hyperlinks in chat text are validated and whitelisted strictly for `http:` and `https:` schemes, preventing `javascript:` or protocol injection attacks.
- **Path Traversal Defense**: Media attachment filenames extracted from chat transcripts are sanitized to strip relative path traversals (`../`, `..\`) and control characters.
- **Deterministic Memory Cleanup**: Ingested media `blob:` URLs are registered in a central lifecycle pool and revoked synchronously upon chat reset or session unmount.

---

## 3. Reporting a Vulnerability

If you discover a potential security vulnerability, client-side data leakage, or Regular Expression Denial of Service (ReDoS) vector, please report it privately:

1. **Do not disclose the vulnerability in public GitHub issues or discussions.**
2. Send an advisory report via GitHub's [Private Vulnerability Reporting](https://github.com/its-ankush-patil/whatsapp-chat-viewer/security/advisories/new) feature, or email the maintainers at `security@example.com` *(or open-source security contact)*.
3. Include the following details in your report:
   - Description of the vulnerability.
   - Minimal reproduction sample or malformed chat snippet.
   - Affected browser(s) and operating system(s).
   - Potential impact.

### Response Timeframe
- **Acknowledgment**: Within 48 hours of report receipt.
- **Status & Assessment**: Within 5 business days.
- **Remediation & Patch**: Targeted within 14 days, followed by public security advisory publication and attribution.
