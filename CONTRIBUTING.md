# Contributing Guide

Contributions to **WhatsApp Chat Viewer** are welcome! Whether you are reporting a bug, optimizing performance, refining the Apple-inspired UI, or adding new locale formats, this guide outlines the workflow and quality standards expected.

---

## 1. Development Environment Setup

1. Fork the repository on GitHub and clone your fork:
   ```bash
   git clone https://github.com/its-ankush-patil/whatsapp-chat-viewer.git
   cd whatsapp-chat-viewer
   ```
2. Install dependencies using Node.js 20+ (Node 24 recommended):
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

> [!NOTE]
> On Windows PowerShell, if `.ps1` execution is restricted, run `npm.cmd run dev` or configure your user policy with `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

---

## 2. Branching & Commit Conventions

### Branch Strategy
Create a focused branch with a descriptive namespace:
* `feat/user-facing-feature` — for new features and UI improvements
* `fix/bug-description` — for bug fixes and parsing corrections
* `perf/optimization` — for memory, rendering, or parsing speed enhancements
* `docs/guide-name` — for documentation or benchmark updates

### Commit Messages (Conventional Commits)
Please adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:
* `feat:` A new feature or user-facing addition
* `fix:` A bug fix or parsing anomaly resolution
* `perf:` A code change that improves execution or rendering performance
* `refactor:` Code changes that neither fix bugs nor add features
* `docs:` Documentation only changes
* `test:` Adding missing tests or correcting existing tests
* `ci:` Changes to CI configuration files and scripts

*Example:* `feat(search): add diacritic folding to full-text search`

---

## 3. Testing & Pre-Flight Quality Check

Before submitting a Pull Request, run the automated verification pipeline:

```bash
# 1. Run the all-in-one quality check (Oxlint + Unit Tests + Vite Build)
npm run check

# 2. Run the performance benchmark stress-test suite
npm run benchmark

# 3. (Optional) Run headless browser E2E integration test
npm run e2e
```

### Quality Acceptance Criteria:
- `oxlint`: Must produce **0 errors and 0 warnings**.
- `node --test`: All 29 unit tests must pass.
- `npm run benchmark`: 50,000 messages must parse in under **350ms** without memory leaks.
- Client-side privacy guarantee: No network requests, trackers, or remote telemetry.

---

## 4. Adding Support for a New Export Language

WhatsApp localizes export strings (e.g. `(file attached)`, `<attached:>`, `<Media omitted>`). To contribute a new locale:

1. Open `src/lib/parser/patterns.js`.
2. Append the localized attachment marker into `FILE_ATTACHED_RE`.
3. Add a unit test in `test/parser.test.js` validating the string.
4. Update the locale table in `docs/SUPPORTED_FORMATS.md`.
5. Run `npm test` to verify.

---

## 5. Submitting Pull Requests

1. Push your branch to your GitHub fork:
   ```bash
   git push -u origin feat/my-enhancement
   ```
2. Open a Pull Request against the `master` branch of the upstream repository.
3. Complete the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) checklist.
4. Ensure the GitHub Actions CI pipeline passes all checks across Node 20.x, 22.x, and 24.x.

---

## 6. Code of Conduct

This project is governed by the [Contributor Covenant v2.1](CODE_OF_CONDUCT.md). By participating, you agree to uphold a welcoming, respectful, and inclusive environment.
