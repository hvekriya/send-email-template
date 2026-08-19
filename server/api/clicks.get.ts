import { readCounts } from '../utils/click-store'

export default defineEventHandler(async () => {
  return await readCounts()
})
