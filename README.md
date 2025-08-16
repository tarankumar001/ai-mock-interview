# AI Mock Interview — casual guide

Welcome — this README is a short, friendly guide for running and updating the AI Mock Interview app.
It covers the essentials: dev, build, deploy, and a few practical tips for quota, webcam, and CI.

What this app does
- Build mock interviews from a job description.
- Generate interview questions + answers using Google Generative AI (Gemini).
- Record spoken answers (speech → text) and receive AI feedback.
- Optional webcam preview while answering.

Quick start — get running locally

1) Clone & install
```bash
git clone <your-repo-url>
cd ai-mock-interview
npm install
```

2) Run locally (dev server)
```bash
# set keys if you want AI and auth to work locally
export VITE_GEMINI_API_KEY="your_key_here"
export VITE_CLERK_PUBLISHABLE_KEY="your_clerk_key"

npm run dev
# open the URL Vite prints (usually http://localhost:5173)
```

3) Build for production
```bash
# ensure VITE_* vars are available at build time
npm run build
```

Deploy to Firebase (quick)
```bash
npx firebase login
npx firebase use --add    # pick your project
npx firebase deploy --only hosting
```
For CI: generate a token with `npx firebase login:ci` and use `--token "$FIREBASE_TOKEN"` in CI.

Environment variables (what matters)
- `VITE_GEMINI_API_KEY` — Google Generative AI key (required for AI calls)
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key (auth)

Set them in your shell or create a local `.env.production` (do not commit secrets).

Change the AI model (quick fix for 429s)
- If you hit daily free-tier limits, try a model with a larger quota. Edit:
  - `src/scripts/index.ts`
  - change `model: "gemini-2.0-flash-exp"` → `model: "gemini-2.0-flash"` or `gemini-2.5-flash-lite`.
- Rebuild and redeploy after the change.

Why 429s happen (short)
- Free-tier models have small daily caps (e.g., 50/day for some experimental models).
- `RetryInfo` (e.g., `"retryDelay":"57s"`) is a short-term backoff suggestion — it doesn't refill the daily quota.
- For steady use: enable billing, request a quota increase in the Cloud Console, or centralize calls on a server.

Webcam tips
- Toggle the camera button in the UI to enable/disable preview.
- If the preview is blank:
  - Make sure the browser has camera permission for the site (click the camera icon near the address bar).
  - Check DevTools Console for `Webcam error` logs.
  - Close other apps using the camera (Zoom, Teams) or try a different device.

Troubleshooting quick cheats
- Build failure: run `npm install` then `npm run build`. Ensure `VITE_` env vars exist at build time.
- Repeated 429s: switch model, enable billing, or cache/batch requests.
- Webcam blank: confirm permissions and `isWebCam` is toggled in the UI.

Useful file map
- `src/scripts/index.ts` — AI model & chat session config (where to change model)
- `src/containers/form-mock-interview.tsx` — create/edit form + AI generation
- `src/components/record-answer.tsx` — recording, speech-to-text, AI feedback
- `src/components/question-section.tsx` — question UI and playback
- `firebase.json` — hosting configuration

Small dev tips
- Move AI calls to a server (recommended): hides keys, centralizes rate limiting, and makes upgrades easier.
- Cache generated questions in Firestore so you don't regenerate on every client interaction.
- The project includes `sendMessageWithRetry` to handle short-term RetryInfo and exponential backoff.

CI snippet: GitHub Actions (optional)
Add a `.github/workflows/deploy.yml` with a job that builds and deploys to Firebase using a `FIREBASE_TOKEN` secret.

Example minimal job step (inside `jobs`):
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: pnpm/action-setup@v2 # or actions/setup-node
    with:
      node-version: '18'
  - run: npm ci
  - run: npm run build
  - run: npx firebase deploy --only hosting --token "$FIREBASE_TOKEN"
```

Contributing & notes
- Small PRs are welcome — bugfixes, UI improvements, tests.
- If you add environment vars, update this README and avoid committing secrets.

License & credits
- Add `LICENSE` if you plan to publish.
- Main packages: React, Vite, Tailwind, Clerk, Firebase, react-webcam, lucide-react, Google Generative AI SDK.
