## Email Your Councillors – CPZ & School Streets (Nuxt 3)

A small Nuxt app for SKS Swaminarayan Temple Woolwich attendees who live in Royal Greenwich. Visitors enter their postcode, pick their ward councillors and open a pre-filled email about the CPZ and School Street on St Margaret's Grove.

### How the letters work

- There are 30 letters in `data/cpz-emails.json`. Each entry has `id`, `subject` and `body`. Bodies start with `Dear Councillor,` (replaced with the selected councillors' names) and end with `[Your name]` (replaced with the sender's name).
- **Each letter is only ever sent once, across the whole site.** When a visitor clicks "Open in email app", the letter is marked as used on the server and never shown again. If two people click the same letter at the same moment, the second person is given a different unused letter.
- The page shows a random unused letter; "Show a different letter" cycles through unused ones.
- A slim progress bar in the top right shows how many letters are left.
- When every letter has been used, the page says "All letters have been used." and the button is turned off. To continue the campaign, add more letters to `data/cpz-emails.json` with new, unique `id`s.

Used letters are stored in Netlify Blobs (store `cpz-letters`, keys `used/<id>`) by the function in `netlify/functions/letters.mjs`, served at `/api/letters`.

### Resetting the used letters

Only if you need to start again (for example after testing):

1. In Netlify, add an environment variable `LETTERS_RESET_SECRET` with a long random value, then redeploy.
2. Run:

   ```bash
   curl -X POST https://object-school-street.netlify.app/api/letters \
     -H "content-type: application/json" \
     -H "x-reset-secret: YOUR_SECRET" \
     -d '{"action":"reset"}'
   ```

Without that variable set, resetting is switched off.

### Running locally

```bash
npm install
npx netlify dev
```

Use `netlify dev` rather than `npm run dev` so the `/api/letters` function runs too. Without it, the page shows an error and sending stays off, because it can't check which letters are unused.

### Deploying to Netlify

`netlify.toml` builds with `npm run generate` and publishes `dist`. Functions are bundled with esbuild. Auto deploys are enabled.
