export default defineNuxtConfig({
  app: {
    head: {
      title: 'Parking Design Email Templates',
      meta: [
        {
          name: 'description',
          content: 'Random email templates for parking design at Royal Greenwich'
        }
      ]
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
