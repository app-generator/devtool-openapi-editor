import 'vuetify/styles' // Global CSS has to be imported
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'
import App from './App.vue'
import { theme as mainTheme } from './themes/main-theme'
import '@mdi/font/css/materialdesignicons.css'
import { createStore } from 'vuex'
import _ from 'lodash'
import { API } from './model'

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

const store = createStore<{ api: API, forceExpand: { key: string } }>({
  state() {
    return {
      api: {
        name: 'My API',
        description: 'an OpenAPI REST descriptor',
        version: '1.0.0',
        entities: [],
        paths: []
      },
      forceExpand: { key: '' }
    }
  },
  mutations: {
    update(state, update) {
      state.api = _.cloneDeep(update)
    },
    expand(state, key) {
      state.forceExpand.key = key
    }
  }
})

app.use(store)

app.mount('#app')
