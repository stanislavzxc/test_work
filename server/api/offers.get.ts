export default defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: 'month_premium',
      title: 'Месяц приключений',
      description: 'Доступ ко всем играм на 30 дней',
      price: 299,
      period: 'месяц',
      isPopular: false,
      badge: ''
    },
    {
      id: 'year_premium',
      title: 'Год супергероя',
      description: 'Полный доступ навсегда + 3 месяца в подарок',
      price: 1490,
      period: 'год',
      isPopular: true,
      badge: 'Выгодно -60%'
    }
  ]
})
