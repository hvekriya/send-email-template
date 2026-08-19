import { getStore } from '@netlify/blobs'

const EMPTY = { mandir: 0, nursery: 0 }

function withTotal(counts) {
  const mandir = Number(counts?.mandir) || 0
  const nursery = Number(counts?.nursery) || 0
  return { mandir, nursery, total: mandir + nursery }
}

export default async (req) => {
  const store = getStore('email-clicks')
  const current = withTotal((await store.get('counts', { type: 'json' })) || EMPTY)

  if (req.method === 'GET') {
    return Response.json(current)
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => ({}))
    const key = body?.template === 'nursery' ? 'nursery' : 'mandir'
    current[key] += 1
    const next = withTotal(current)
    await store.setJSON('counts', { mandir: next.mandir, nursery: next.nursery })
    return Response.json(next)
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config = {
  path: '/api/clicks'
}
