interface PurchaseBody {
  offerId: string
  userId: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<PurchaseBody>(event)

  if (!body?.offerId || !body?.userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неверные данные: offerId и userId обязательны',
    })
  }

  const validOffers = ['month_premium', 'year_premium']
  if (!validOffers.includes(body.offerId)) {
    throw createError({ statusCode: 422, statusMessage: 'Указанный тариф не существует' })
  }

  try {
    const DB = event.context.cloudflare.env.DB
    const createdAt = new Date().toISOString()

    await DB
      .prepare('INSERT INTO purchases (offer_id, user_id, created_at) VALUES (?, ?, ?)')
      .bind(body.offerId, body.userId, createdAt)
      .run()

    return {
      success: true,
      message: 'Покупка зарегистрирована',
      data: { offerId: body.offerId, userId: body.userId, timestamp: createdAt },
    }
  } catch (error: any) {
    console.error('Ошибка записи в БД:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Не удалось сохранить покупку',
    })
  }
})
