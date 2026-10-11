export const TEMPLATE_KEYS = ['cpz', 'mandir', 'nursery'] as const
export type TemplateKey = typeof TEMPLATE_KEYS[number]

export const EMPTY_COUNTS: Record<TemplateKey, number> = { cpz: 0, mandir: 0, nursery: 0 }

export function normaliseTemplate(value: unknown): TemplateKey {
  return (TEMPLATE_KEYS as readonly string[]).includes(value as string) ? (value as TemplateKey) : 'mandir'
}

export function withTotal(counts: Partial<Record<TemplateKey, unknown>> | null | undefined) {
  const cpz = Number(counts?.cpz) || 0
  const mandir = Number(counts?.mandir) || 0
  const nursery = Number(counts?.nursery) || 0
  return { cpz, mandir, nursery, total: cpz + mandir + nursery }
}
