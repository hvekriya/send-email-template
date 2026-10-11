import { EMPTY_COUNTS, withTotal, type TemplateKey } from './click-counts'

const memoryCounts = { ...EMPTY_COUNTS }

async function netlifyStore() {
  const { getStore } = await import('@netlify/blobs')
  return getStore('email-clicks')
}

export async function readCounts() {
  try {
    const store = await netlifyStore()
    const saved = await store.get('counts', { type: 'json' })
    return withTotal(saved || memoryCounts)
  } catch {
    return withTotal(memoryCounts)
  }
}

export async function incrementCount(key: TemplateKey) {
  try {
    const store = await netlifyStore()
    const saved = withTotal((await store.get('counts', { type: 'json' })) || memoryCounts)
    saved[key] += 1
    const next = withTotal(saved)
    await store.setJSON('counts', { cpz: next.cpz, mandir: next.mandir, nursery: next.nursery })
    Object.assign(memoryCounts, { cpz: next.cpz, mandir: next.mandir, nursery: next.nursery })
    return next
  } catch {
    memoryCounts[key] += 1
    return withTotal(memoryCounts)
  }
}
