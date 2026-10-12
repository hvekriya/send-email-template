export default defineNuxtConfig({
  app: {
    head: {
      title: 'Email Your Councillors – CPZ & School Streets',
      meta: [
        {
          name: 'description',
          content: 'Email your Royal Greenwich ward councillors about the CPZ and School Street affecting SKS Swaminarayan Temple Woolwich'
        }
      ]
    }
  },
  nitro: {
    prerender: {
      // Served by the Netlify function, not prerendered.
      ignore: ['/api/letters']
    }
  },
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
