export default defineNuxtConfig({
      modules: ['@nuxthub/core', '@nuxt/fonts'],
        hub: {
            database: true,
              },
                nitro: {
                    cloudflare: {
                          wrangler: {
                                  d1_databases: [
                                            {
                                                        binding: 'DB',
                                                                    database_id: '04973fe2-17f5-4dda-...', // ПОЛНЫЙ UUID из D1
                                                                              },
                                                                                      ],
                                                                                            },
                                                                                                },
                                                                                                  },
                                                                                                  })
})