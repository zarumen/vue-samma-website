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
    <v-app-bar
      dark
      color="default"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <img src="@/assets/gtuFavicon.png" height="36px"/>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-list class="transparent">
          <v-list-item v-if="checkUserProfile" avatar>
            <v-list-item-avatar>
              <v-img
                v-if="checkPicUrl"
                :src="getProfilePicUrl"
                max-height="36"
              />
              <img
                v-else
                src="https://randomuser.me/api/portraits/men/85.jpg"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ profileName }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-toolbar-items>
    </v-app-bar>
    <v-navigation-drawer
      absolute
      temporary
      v-model="drawer"
    >
      <v-list>
        <v-list-item
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to="item.link"
          router
        >
          <v-list-item-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <slot/>
    </v-content>
  </div>
</template>
