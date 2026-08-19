import { incrementCount } from '../utils/click-store'
import { normaliseTemplate } from '../utils/click-counts'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  return await incrementCount(normaliseTemplate(body?.template))
})
