import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee, faGoogle)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Vuetify, {
  theme: {
    primary: '#42A5F5',
    secondary: '#D32F2F',
    accent: '#ff2036',
    error: '#c9001f',
    info: '#01579b',
    success: '#4CAF50',
    warning: '#ff6d00'
  }
})
