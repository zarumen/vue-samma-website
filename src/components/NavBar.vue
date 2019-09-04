<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'bubble_chart',
          title: 'หน้าหลัก',
          link: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'สมัครเปิดบ้านสวดฯ',
          link: '/dmjsignup'
        },
        {
          icon: 'bubble_chart',
          title: 'กรอกข้อมูล ชวนเปิดบ้านสวดฯ',
          link: '/dmjinvited'
        },
        {
          icon: 'bubble_chart',
          title: 'ขุนพลธรรมจักร',
          link: '/leadersignup'
        },
        {
          icon: 'bubble_chart',
          title: 'ข้อมูลเพิ่มเติม',
          link: '/about'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: ''
    }
  },
  computed: {
    ...mapGetters('dmj', ['getUser', 'checkUserProfile']),
    getProfilePicUrl () {
      if (this.checkUserProfile) return this.getUser.pictureUrl

      return null
    },
    profileName () {
      if (this.checkUserProfile) return this.getUser.displayName

      return null
    },
    checkPicUrl () {
      return !!this.getProfilePicUrl
    }
  }
}
</script>

<template>
  <div>
    <v-navigation-drawer
      persistent
      v-model="drawer"
      enable-resize-watcher
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to="item.link"
          router
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      dark
      color="secondary"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img src="@/assets/gtuFavicon.png" height="36px"/>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-list class="transparent">
          <v-list-tile v-if="checkUserProfile" avatar>
            <v-list-tile-avatar>
              <v-img
                v-if="checkPicUrl"
                :src="getProfilePicUrl"
                max-height="36"
              />
              <img
                v-else
                src="https://randomuser.me/api/portraits/men/85.jpg"
              />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ profileName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <slot/>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
