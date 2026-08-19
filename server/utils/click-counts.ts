export const EMPTY_COUNTS = { mandir: 0, nursery: 0 }

export function normaliseTemplate(value) {
  return value === 'nursery' ? 'nursery' : 'mandir'
}

export function withTotal(counts) {
  const mandir = Number(counts?.mandir) || 0
  const nursery = Number(counts?.nursery) || 0
  return { mandir, nursery, total: mandir + nursery }
}
