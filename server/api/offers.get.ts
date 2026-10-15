export default defineEventHandler(async (event) => {
  const DB = event.context.cloudflare.env.DB

  const { results } = await DB
    .prepare('SELECT id, title, description, price, period, is_popular, badge FROM offers ORDER BY is_popular DESC, price ASC')
    .all()

  return results.map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    period: row.period,
    isPopular: Boolean(row.is_popular),
    badge: row.badge ?? '',
  }))
})
