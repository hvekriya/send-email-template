export default defineNuxtConfig({
  app: {
    head: {
      title: 'School Streets Email Templates',
      meta: [
        {
          name: 'description',
          content: 'Email templates for School Streets at Royal Greenwich'
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
