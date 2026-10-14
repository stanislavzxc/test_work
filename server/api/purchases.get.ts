import { hubDatabase } from '#imports'
export default defineEventHandler(async () => {
  const DB = hubDatabase()
  const { results } = await DB
    .prepare('SELECT * FROM purchases ORDER BY created_at DESC LIMIT 10')
    .all()
  return { purchases: results }
})
