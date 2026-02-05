## Parking Design Email Templates (Nuxt 3)

This is a small Nuxt 3 app that shows a **random email template** for the Parking Design team at the Royal Borough of Greenwich.

Each template has a subject and body. You can:

- **See a random template** on screen
- **Shuffle** to another random template
- **Open your email app** with the subject and body pre-filled, addressed to:
  - `parking-design@royalgreenwich.gov.uk`

### Getting started

1. **Install dependencies**

   ```bash
   cd nuxt-email-templates
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

### Where to edit templates

- All templates live in `data/emails.json`.
- Each entry has:
  - `id` – a numeric identifier
  - `subject` – the email subject line
  - `body` – the email body text

You can change or add templates there; the UI will automatically pick a random one.

### Deploying to Netlify

The repo is set up for Netlify with `netlify.toml` (static build: `npm run generate`, publish: `.output/public`).

**Option A – Deploy via Git (recommended)**

1. Push this repo to GitHub or GitLab.
2. Log in at [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Choose your Git provider and select this repository.
4. Netlify will use the build settings from `netlify.toml`. Click **Deploy site**.

**Option B – Deploy with Netlify CLI**

1. Install the CLI: `npm install -g netlify-cli` (if needed).
2. Log in: `netlify login`.
3. Link (or create) a site: `netlify link` or `netlify init`.
4. Deploy: `netlify deploy --prod` (build runs automatically from `netlify.toml`).

