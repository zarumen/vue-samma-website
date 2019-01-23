<script>
import navbar from '@/components/NavBar.vue'

export default {
  name: 'App',
  components: {
    navbar
  },
  data () {
    return {
      fixed: false
    }
  }
}
</script>

<template>
  <v-app>
    <navbar>
      <router-view/>
    </navbar>
    <v-footer color="grey darken-1" :fixed="fixed" dark app>
      <span>&copy; RGT.soft 2018</span>
    </v-footer>
  </v-app>
</template>
