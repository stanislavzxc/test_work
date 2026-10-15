export default defineEventHandler(async (event) => {
  const DB = event.context.cloudflare.env.DB
  const { results } = await DB
    .prepare('SELECT * FROM purchases ORDER BY created_at DESC LIMIT 10')
    .all()
  return { purchases: results }
})
