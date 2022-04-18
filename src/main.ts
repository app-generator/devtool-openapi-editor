import 'vuetify/styles' // Global CSS has to be imported
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'
import App from './App.vue'
import { theme as mainTheme } from './themes/main-theme'
import '@mdi/font/css/materialdesignicons.css'
import { createStore } from 'vuex'
import { OpenAPIObject } from 'openapi3-ts'
import _ from 'lodash'

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

const store = createStore<{ api: OpenAPIObject }>({
  state() {
    return {
      api: {
        openapi: "3.0.0",
        info: {
          title: "My New API",
          version: "1.0.0",
        },
        paths: {},
        components: {
          schemas: {},
          securitySchemes: {},
        },
      }
    };
  },
  mutations: {
    update(state, update) {
      state.api = _.cloneDeep(update)
    }
  }
})

app.use(store)

app.mount('#app')
