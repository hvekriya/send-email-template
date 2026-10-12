import { getStore } from '@netlify/blobs'
import letters from '../../data/cpz-emails.json'

// Every letter can be sent once, across the whole site. A letter is marked as
// used when someone clicks "Open in email app" (we cannot see whether the email
// was actually sent). Used letters are stored as keys "used/<id>".

const ALL_IDS = letters.map((letter) => letter.id)
const PREFIX = 'used/'

const openStore = () => getStore({ name: 'cpz-letters', consistency: 'strong' })
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function readUsed(store) {
  const { blobs } = await store.list({ prefix: PREFIX })
  return new Set(blobs.map((blob) => Number(blob.key.slice(PREFIX.length))))
}

async function summary(store) {
  const used = await readUsed(store)
  return { total: ALL_IDS.length, remaining: ALL_IDS.filter((id) => !used.has(id)) }
}

/** Returns true only if this request is the one that marked the letter as used. */
async function tryClaim(store, id) {
  const key = `${PREFIX}${id}`
  if (await store.get(key)) return false

  const token = crypto.randomUUID()
  const result = await store.setJSON(key, { token, at: new Date().toISOString() }, { onlyIfNew: true })

  // Newer versions of @netlify/blobs support atomic "only if new" writes.
  if (result && typeof result.modified === 'boolean') return result.modified

  // Older versions ignore onlyIfNew: wait briefly, then check our write is the one that stuck.
  await sleep(300)
  const saved = await store.get(key, { type: 'json' })
  return saved?.token === token
}

function shuffle(list) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default async (req) => {
  const store = openStore()

  if (req.method === 'GET') {
    return Response.json(await summary(store))
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.json().catch(() => ({}))

  if (body?.action === 'reset') {
    const secret = process.env.LETTERS_RESET_SECRET
    if (!secret || req.headers.get('x-reset-secret') !== secret) {
      return new Response('Forbidden', { status: 403 })
    }
    const { blobs } = await store.list({ prefix: PREFIX })
    await Promise.all(blobs.map((blob) => store.delete(blob.key)))
    return Response.json(await summary(store))
  }

  // Claim: try the letter the visitor is looking at, then any other unused letter.
  const { remaining } = await summary(store)
  const requested = Number(body?.id)
  const order = remaining.includes(requested)
    ? [requested, ...shuffle(remaining.filter((id) => id !== requested))]
    : shuffle(remaining)

  for (const id of order) {
    if (await tryClaim(store, id)) {
      return Response.json({ claimed: id, ...(await summary(store)) })
    }
  }

  return Response.json({ claimed: null, ...(await summary(store)) })
}

export const config = {
  path: '/api/letters'
}
