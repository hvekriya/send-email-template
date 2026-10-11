import { getStore } from '@netlify/blobs'

const KEYS = ['cpz', 'mandir', 'nursery']

function withTotal(counts) {
  const out = {}
  for (const key of KEYS) out[key] = Number(counts?.[key]) || 0
  out.total = KEYS.reduce((sum, key) => sum + out[key], 0)
  return out
}

function normaliseTemplate(value) {
  return KEYS.includes(value) ? value : 'mandir'
}

export default async (req) => {
  const store = getStore('email-clicks')
  const current = withTotal((await store.get('counts', { type: 'json' })) || {})

  if (req.method === 'GET') {
    return Response.json(current)
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => ({}))
    const key = normaliseTemplate(body?.template)
    current[key] += 1
    const next = withTotal(current)
    const { total, ...saved } = next
    await store.setJSON('counts', saved)
    return Response.json(next)
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config = {
  path: '/api/clicks'
}
