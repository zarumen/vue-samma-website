import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#009688', // $deep-purple
        secondary: '#ffc107', // $yellow-green
        accent: '#1976d2',
        error: '#D50000',
        warning: '#FF9800',
        info: '#C4E5C5',
        success: '#1C8B2D',
        default: '#d42b2b'
      },
      dark: {
        primary: '#FFFFFF',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      }
    }
  },
  iconfont: 'mdi',
  options: {
    customProperties: true
  }
})
