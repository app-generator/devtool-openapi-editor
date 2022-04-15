import 'vuetify/styles' // Global CSS has to be imported
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'
import App from './App.vue'
import { theme as mainTheme } from './themes/main-theme'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)
const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
  theme: {
    defaultTheme: 'mainTheme',
    themes: {
      mainTheme
    }
  }
}
)

app.use(vuetify)

app.mount('#app')
