

export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@nuxt/fonts'],
  hub: {
    database: true,
  },
  nitro: {
    cloudflare: {
      wrangler: {
        name: 'test-work',
        d1_databases: [
          {
            binding: 'DB',
            database_id: "04973fe2-17f5-4ddc-9888-a46119620a08"
          }',
          },
        ],
      },
    },
  },
})
