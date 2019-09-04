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
  },
  beforeCreate () {
    this.$liff.init(
      data => {
        const userId = data.context.userId
        console.log(userId)
      },
      error => {
        console.log(error)
      }
    )
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
