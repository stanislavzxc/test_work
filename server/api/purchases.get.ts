export default defineEventHandler(async () => {
  const db = hubDatabase()
  const { results } = await db
    .prepare('SELECT * FROM purchases ORDER BY created_at DESC LIMIT 10')
    .all()
  return { purchases: results }
})