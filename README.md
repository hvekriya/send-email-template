## Parking Design Email Templates (Nuxt 3)

This is a small Nuxt 3 app that shows a **random email template** for Sustainable Streets at the Royal Borough of Greenwich.

Each template has a subject and body. You can:

- **See a random template** on screen
- **Shuffle** to another random template
- **Open your email app** with the subject and body pre-filled, addressed to:
  - `Sustainable.Streets@royalgreenwich.gov.uk`

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

The repo is set up for Netlify with `netlify.toml` (static build: `npm run generate`, publish: `dist`).

Auto deploys are enabled.

