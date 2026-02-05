export default defineNuxtConfig({
  app: {
    head: {
      title: 'Sustainable Streets Email Templates',
      meta: [
        {
          name: 'description',
          content: 'Email templates for Sustainable Streets at Royal Greenwich'
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
