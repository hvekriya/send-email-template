<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4 py-10">
    <main class="w-full max-w-3xl bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl shadow-slate-900/40 p-8 md:p-10 space-y-8">
      <header class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Royal Borough of Greenwich
        </p>
        <h1 class="text-2xl md:text-3xl font-semibold tracking-tight">
          School Streets – Email Template Generator
        </h1>
        <p class="text-sm md:text-base text-slate-300">
          Enter your postcode to find your ward councillors, then open a pre-filled objection email to the people you choose.
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
        <div class="space-y-2">
          <label for="user-postcode" class="block">
            <span class="text-sm font-semibold tracking-wide text-slate-300 uppercase">Your postcode</span>
            <span class="text-red-400 ml-1" aria-hidden="true">*</span>
          </label>
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              id="user-postcode"
              v-model="state.postcode"
              type="text"
              autocomplete="postal-code"
              placeholder="e.g. SE18 7RL"
              class="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-slate-100 placeholder-slate-500 uppercase focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
              :aria-invalid="!!lookupError"
              :aria-describedby="lookupError ? 'postcode-error' : undefined"
              @keyup.enter="lookupPostcode"
            />
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:bg-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed transition"
              :disabled="lookupLoading"
              @click="lookupPostcode"
            >
              {{ lookupLoading ? 'Finding…' : 'Find councillors' }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <label for="ward-select" class="block text-xs text-slate-400">
            Or choose your ward
          </label>
          <select
            id="ward-select"
            v-model="state.wardName"
            class="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
            @change="onWardSelect"
          >
            <option value="">Select a Greenwich ward</option>
            <option v-for="ward in wardData.wards" :key="ward.id" :value="ward.name">
              {{ ward.name }}
            </option>
          </select>
        </div>

        <p
          v-if="lookupError"
          id="postcode-error"
          class="text-sm text-amber-400"
          role="alert"
        >
          {{ lookupError }}
        </p>
      </section>

      <section v-if="currentWard" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 class="text-sm font-semibold tracking-wide text-slate-300 uppercase">
              Your councillors
            </h2>
            <p class="text-sm text-slate-300 mt-1">
              Ward: <span class="font-semibold text-emerald-200">{{ currentWard.name }}</span>
              <span v-if="lookedUpPostcode" class="text-slate-400"> · {{ lookedUpPostcode }}</span>
            </p>
          </div>
          <div class="flex gap-3 text-xs">
            <button type="button" class="text-emerald-300 hover:text-emerald-200" @click="selectAllCouncillors">
              Select all
            </button>
            <button type="button" class="text-slate-400 hover:text-slate-200" @click="state.selectedIds = []">
              Clear
            </button>
          </div>
        </div>

        <p class="text-xs text-slate-400">
          Choose who should receive the email. You can select more than one.
        </p>

        <div class="grid grid-cols-1 gap-3">
          <label
            v-for="councillor in currentWard.councillors"
            :key="councillor.id"
            class="flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors"
            :class="isSelected(councillor.id)
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-slate-600 bg-slate-900/60 hover:border-slate-500'"
          >
            <input
              class="mt-2 h-4 w-4 accent-emerald-500 shrink-0"
              type="checkbox"
              :value="councillor.id"
              :checked="isSelected(councillor.id)"
              @change="toggleCouncillor(councillor.id)"
            />
            <img
              v-if="!hiddenPhotos[councillor.id]"
              :src="councillor.photo"
              :alt="councillor.fullName"
              class="h-20 w-14 rounded-md object-cover bg-slate-700 shrink-0"
              @error="hiddenPhotos[councillor.id] = true"
            />
            <div class="min-w-0 space-y-1">
              <p class="font-semibold text-slate-100">{{ councillor.fullName }}</p>
              <p class="text-xs">
                <span
                  class="inline-flex rounded-full px-2 py-0.5 font-medium"
                  :class="partyClass(councillor.party)"
                >
                  {{ councillor.party }}
                </span>
              </p>
              <p v-if="councillor.role" class="text-sm text-emerald-200">
                {{ councillor.role }}
              </p>
              <p class="text-sm text-slate-300 font-mono break-all">
                {{ councillor.email }}
              </p>
              <a
                :href="councillor.profileUrl"
                target="_blank"
                rel="noreferrer"
                class="inline-block text-xs text-emerald-300 hover:text-emerald-200"
                @click.stop
              >
                View official profile ↗
              </a>
            </div>
          </label>
        </div>
        <p class="text-[11px] text-slate-500">
          Councillor details from the
          <a
            :href="currentWard.findUrl"
            target="_blank"
            rel="noreferrer"
            class="text-emerald-300 hover:text-emerald-200"
          >Royal Borough of Greenwich ward list</a>.
        </p>
      </section>

      <section class="space-y-3">
        <fieldset>
          <legend class="text-sm font-semibold tracking-wide text-slate-300 uppercase">
            Email template
          </legend>
          <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              v-for="template in templates"
              :key="template.id"
              class="flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors"
              :class="state.templateId === template.id
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-600 bg-slate-800/80 hover:border-slate-500'"
            >
              <input
                v-model="state.templateId"
                class="mt-1 h-4 w-4 accent-emerald-500"
                type="radio"
                name="email-template"
                :value="template.id"
              />
              <span>
                <span class="block text-sm font-semibold text-slate-100">{{ template.label }}</span>
                <span class="block text-xs text-slate-400 mt-0.5">
                  {{ template.id === 'mandir' ? 'Temple attendees' : 'Nursery drop-off and pick-up' }}
                </span>
              </span>
            </label>
          </div>
        </fieldset>
      </section>

      <section class="space-y-4">
        <h2 class="text-sm font-semibold tracking-wide text-slate-300 uppercase">
          Current email template
        </h2>

        <div class="rounded-xl border border-slate-700 bg-slate-900/60 p-5 md:p-6 space-y-4">
          <div class="space-y-1.5">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              To
            </p>
            <p class="text-sm text-slate-200">
              {{ selectedCouncillors.length
                ? selectedCouncillors.map((councillor) => councillor.email).join(', ')
                : 'Select one or more councillors above' }}
            </p>
          </div>

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
            <pre class="whitespace-pre-wrap break-words text-sm md:text-[0.95rem] leading-relaxed text-slate-100 font-sans bg-slate-900/90 rounded-lg p-4 border border-slate-800/80">{{ previewBody }}</pre>
          </div>
        </div>
      </section>

      <section class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div class="text-xs text-slate-400 space-y-1">
          <p>{{ currentEmail.label }} objection template</p>
          <p v-if="countsLoaded">
            Opened in email app:
            <span class="font-mono text-slate-200">Mandir {{ counts.mandir }}</span>
            ·
            <span class="font-mono text-slate-200">Nursery {{ counts.nursery }}</span>
          </p>
        </div>

        <a
          v-if="canSendEmail"
          :href="mailtoLink"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition"
          @click="trackOpen"
        >
          <span>Open in email app</span>
          <span class="text-slate-900/80 text-base">↗</span>
        </a>
        <button
          v-else
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 cursor-not-allowed"
          disabled
          aria-describedby="send-required-hint"
        >
          <span>Open in email app</span>
          <span class="text-base">↗</span>
        </button>
        <p id="send-required-hint" class="sr-only">
          Enter your name and select at least one councillor to enable this button.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import templates from '~/data/templates.json'
import wardData from '~/data/wards.json'

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i

const state = reactive({
  templateId: templates[0]?.id || 'mandir',
  userName: '',
  nameTouched: false,
  postcode: '',
  wardName: '',
  selectedIds: []
})

const lookupLoading = ref(false)
const lookupError = ref('')
const lookedUpPostcode = ref('')
const hiddenPhotos = reactive({})

const counts = reactive({
  mandir: 0,
  nursery: 0,
  total: 0
})
const countsLoaded = ref(false)

const currentWard = computed(() =>
  wardData.wards.find((ward) => ward.name === state.wardName) || null
)

const selectedCouncillors = computed(() => {
  if (!currentWard.value) return []
  return currentWard.value.councillors.filter((councillor) =>
    state.selectedIds.includes(councillor.id)
  )
})

const canSendEmail = computed(() =>
  state.userName.trim().length > 0 && selectedCouncillors.value.length > 0
)
const showNameError = computed(() => state.nameTouched && !state.userName.trim())

function onNameBlur() {
  state.nameTouched = true
}

function isSelected(id) {
  return state.selectedIds.includes(id)
}

function toggleCouncillor(id) {
  if (isSelected(id)) {
    state.selectedIds = state.selectedIds.filter((value) => value !== id)
  } else {
    state.selectedIds = [...state.selectedIds, id]
  }
}

function selectAllCouncillors() {
  state.selectedIds = (currentWard.value?.councillors || []).map((councillor) => councillor.id)
}

function onWardSelect() {
  lookupError.value = ''
  lookedUpPostcode.value = ''
  state.selectedIds = []
}

function normalisePostcode(value) {
  const compact = (value || '').toUpperCase().replace(/\s+/g, '')
  if (compact.length < 5) return compact
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`
}

function normaliseWardName(value) {
  return (value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findWardByName(name) {
  const needle = normaliseWardName(name)
  return wardData.wards.find((ward) => normaliseWardName(ward.name) === needle)
    || wardData.wards.find((ward) => normaliseWardName(ward.name).includes(needle) || needle.includes(normaliseWardName(ward.name)))
}

function partyClass(party) {
  if (/green/i.test(party)) return 'bg-emerald-500/20 text-emerald-200'
  if (/conservative/i.test(party)) return 'bg-blue-500/20 text-blue-200'
  if (/reform/i.test(party)) return 'bg-cyan-500/20 text-cyan-200'
  if (/labour/i.test(party)) return 'bg-rose-500/20 text-rose-200'
  return 'bg-slate-500/20 text-slate-200'
}

async function lookupPostcode() {
  lookupError.value = ''
  const postcode = normalisePostcode(state.postcode)
  state.postcode = postcode

  if (!UK_POSTCODE.test(postcode)) {
    lookupError.value = 'Enter a valid UK postcode, for example SE18 7RL.'
    return
  }

  lookupLoading.value = true
  try {
    const data = await $fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`)
    const result = data?.result
    if (!result) {
      lookupError.value = 'That postcode could not be found.'
      return
    }

    if (result.admin_district !== 'Greenwich') {
      lookupError.value = `This postcode is in ${result.admin_district || 'another area'}, not the Royal Borough of Greenwich.`
      state.wardName = ''
      state.selectedIds = []
      lookedUpPostcode.value = ''
      return
    }

    const ward = findWardByName(result.admin_ward)
    if (!ward) {
      lookupError.value = `Your postcode is in ${result.admin_ward}, which is not in this councillor list yet.`
      return
    }

    state.wardName = ward.name
    lookedUpPostcode.value = result.postcode
    state.selectedIds = []
  } catch (error) {
    const status = error?.statusCode || error?.status || error?.response?.status
    if (status === 404) {
      lookupError.value = 'That postcode could not be found.'
    } else {
      lookupError.value = 'We could not look up that postcode just now. You can still choose your ward from the list.'
    }
  } finally {
    lookupLoading.value = false
  }
}

function councillorGreeting() {
  const names = selectedCouncillors.value.map((councillor) => councillor.name)
  if (names.length === 0) return 'Dear Councillor,'
  if (names.length === 1) return `Dear Councillor ${names[0]},`
  if (names.length === 2) return `Dear Councillors ${names[0]} and ${names[1]},`
  return `Dear Councillors ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]},`
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

/** Replaces [Your name] with the user's name and formats with newlines. */
function formatBody(body, userName) {
  if (!body) return ''
  const name = userName?.trim() || ''
  const hadNamePlaceholder = /\[Your name\]/.test(body)
  let out = body
    .replace(/^Dear School Streets Traffic Regulation Order Team,/i, councillorGreeting())
    .replace(/\n\[Your address\]\r?\n?/g, '\n')
    .replace(/\n\[Your contact details\]\r?\n?/g, '\n')
    .replace(/\[Your name\]/g, name || '[Your name]')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()
  out = insertParagraphBreaks(out)
  if (name && !hadNamePlaceholder) out = out + '\n' + name
  return out.trimEnd()
}

const currentEmail = computed(() =>
  templates.find((template) => template.id === state.templateId) || templates[0] || { subject: '', body: '', label: '' }
)

const previewBody = computed(() =>
  formatBody(currentEmail.value.body || '', state.userName)
)

const mailtoLink = computed(() => {
  const to = selectedCouncillors.value.map((councillor) => councillor.email).join(',')
  const subject = encodeURIComponent(currentEmail.value.subject || '')
  const bodyText = formatBody(currentEmail.value.body || '', state.userName)
  const bodyWithLineBreaks = bodyText.replace(/\n/g, '\r\n')
  const body = encodeURIComponent(bodyWithLineBreaks)
  return `mailto:${to}?subject=${subject}&body=${body}`
})

function applyCounts(data) {
  if (!data) return
  counts.mandir = Number(data.mandir) || 0
  counts.nursery = Number(data.nursery) || 0
  counts.total = Number(data.total) || counts.mandir + counts.nursery
}

async function loadCounts() {
  try {
    applyCounts(await $fetch('/api/clicks'))
    countsLoaded.value = true
  } catch {
    // Counts are only available when the API is running (nuxt dev or Netlify).
  }
}

function trackOpen() {
  $fetch('/api/clicks', {
    method: 'POST',
    body: { template: state.templateId }
  })
    .then((data) => {
      applyCounts(data)
      countsLoaded.value = true
    })
    .catch(() => {})
}

onMounted(() => {
  loadCounts()
})
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
