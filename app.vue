<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4 py-10">
    <main class="w-full max-w-3xl bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl shadow-slate-900/40 p-8 md:p-10 space-y-8">
      <header class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Royal Borough of Greenwich
        </p>
        <h1 class="text-2xl md:text-3xl font-semibold tracking-tight">
          Sustainable Streets – Email Template Generator
        </h1>
        <p class="text-sm md:text-base text-slate-300">
          Click the button below to open this template in your email app, pre‑filled and ready to send to
          <span class="font-mono text-emerald-300">Sustainable.Streets@royalgreenwich.gov.uk</span>.
        </p>
      </header>

      <section class="space-y-4">
        <label for="user-name" class="block">
          <span class="text-sm font-semibold tracking-wide text-slate-300 uppercase">Your name</span>
          <span class="text-red-400 ml-1" aria-hidden="true">*</span>
        </label>
        <input
          id="user-name"
          v-model.trim="state.userName"
          type="text"
          required
          placeholder="Enter your full name"
          class="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
          :aria-invalid="showNameError"
          :aria-describedby="showNameError ? 'name-error' : undefined"
          @blur="onNameBlur"
        />
        <p
          v-if="showNameError"
          id="name-error"
          class="text-sm text-amber-400"
          role="alert"
        >
          Please enter your name to send the email.
        </p>
      </section>

      <section class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-sm font-semibold tracking-wide text-slate-300 uppercase">
            Current email template
          </h2>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-slate-600/80 bg-slate-800/80 px-4 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700/80 hover:border-slate-500 transition-colors"
            @click="pickRandomEmail"
          >
            <span>Shuffle</span>
            <span class="text-slate-400">⟳</span>
          </button>
        </div>

        <div class="rounded-xl border border-slate-700 bg-slate-900/60 p-5 md:p-6 space-y-4">
          <div class="space-y-1.5">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Subject
            </p>
            <p class="text-base md:text-lg font-medium text-emerald-200">
              {{ currentEmail.subject }}
            </p>
          </div>

          <div class="border-t border-slate-800/80 pt-4 space-y-2">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Body preview
            </p>
            <pre class="whitespace-pre-wrap break-words text-sm md:text-[0.95rem] leading-relaxed text-slate-100 font-sans bg-slate-900/90 rounded-lg p-4 border border-slate-800/80">
{{ previewBody }}
            </pre>
          </div>
        </div>
      </section>

      <section class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div class="text-xs text-slate-400 space-y-1">
          <p>
            Template <span class="font-mono text-slate-200">{{ currentIndex + 1 }}</span>
            of <span class="font-mono text-slate-200">{{ emails.length }}</span>
          </p>
          <p class="text-[11px]">
            You can refresh the page or use the shuffle button to see another random template.
          </p>
        </div>

        <a
          v-if="canSendEmail"
          :href="mailtoLink"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition"
        >
          <span>Open in email app</span>
          <span class="text-slate-900/80 text-base">↗</span>
        </a>
        <button
          v-else
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 cursor-not-allowed"
          disabled
          aria-describedby="name-required-hint"
        >
          <span>Open in email app</span>
          <span class="text-base">↗</span>
        </button>
        <p id="name-required-hint" class="sr-only">Enter your name above to enable this button.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import emails from '~/data/emails.json'

const state = reactive({
  currentIndex: 0,
  userName: '',
  nameTouched: false
})

const canSendEmail = computed(() => state.userName.trim().length > 0)
const showNameError = computed(() => state.nameTouched && !state.userName.trim())

function onNameBlur() {
  state.nameTouched = true
}

/** Inserts newlines so the body is readable (after greeting and before sign-off). */
function insertParagraphBreaks(text) {
  if (!text) return ''
  return text
    .replace(/\b(Dear [^,]+,)\s*/i, '\n\n$1\n\n')
    .replace(/\s+(Yours sincerely|Yours faithfully|Kind regards|Best wishes|To the Council,)\s*\.?\s*$/i, '\n\n$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Replaces [Your name] with the user's name, removes [Your address]/[Your contact details], adds name at end, and formats with newlines. */
function formatBody(body, userName) {
  if (!body) return ''
  const name = userName?.trim() || ''
  let out = body
    .replace(/\n\[Your address\]\r?\n?/g, '\n')
    .replace(/\n\[Your contact details\]\r?\n?/g, '\n')
    .replace(/\[Your name\]/g, name || '[Your name]')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()
  out = insertParagraphBreaks(out)
  if (name) out = out + '\n' + name
  return out.trimEnd()
}

const previewBody = computed(() =>
  formatBody(currentEmail.value.body || '', state.userName)
)

const pickRandomEmail = () => {
  if (!emails.length) return

  let next = Math.floor(Math.random() * emails.length)

  // Avoid repeating the same email if there is more than one
  if (emails.length > 1 && next === state.currentIndex) {
    next = (next + 1) % emails.length
  }

  state.currentIndex = next
}

const currentEmail = computed(() => emails[state.currentIndex] || { subject: '', body: '' })

const mailtoLink = computed(() => {
  const to = 'Sustainable.Streets@royalgreenwich.gov.uk'
  const subject = encodeURIComponent(currentEmail.value.subject || '')
  const bodyText = formatBody(currentEmail.value.body || '', state.userName)
  const bodyWithLineBreaks = bodyText.replace(/\n/g, '\r\n')
  const body = encodeURIComponent(bodyWithLineBreaks)
  return `mailto:${to}?subject=${subject}&body=${body}`
})

// Pick an initial random email on load
onMounted(() => {
  pickRandomEmail()
})

const emailsLength = emails.length
const currentIndex = computed(() => state.currentIndex)
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
}
</style>

