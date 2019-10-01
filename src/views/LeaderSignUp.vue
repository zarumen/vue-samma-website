<script>
import axiosDB from '@/utils/axios-db.js'
import firestoreApp from '@/utils/firestore-config.js'
import { mapMutations, mapGetters } from 'vuex'

export default {
  data () {
    return {
      title: 'คีย์ผลงานชวนสวด ธรรมจักร',
      titleShort: 'คีย์ผลงานชวนสวด ธรรมจักร',
      errorText: 'กรุณากรอกข้อมูลในช่องที่กำหนด',
      isLoading: false,
      isLoading2: false,
      items: [],
      itemsLeader: [],
      model: null,
      search: null,
      searchLeader: null,
      errorMessages: '',
      formHasErrors: false,
      membername: null,
      telnumber: null,
      menu: false,
      birthDate: null,
      gender: 'Male',
      dialog: false,
      address: null,
      isMobile: false
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  computed: {
    ...mapGetters('dmj', ['getUser', 'checkUserProfile']),
    form () {
      return {
        campusId: this.model,
        leaderId: this.address.userId,
        leaderName: this.address.fullname,
        memberName: this.membername,
        memberGender: this.gender,
        memberTel: this.telnumber,
        memberBirthDate: this.birthDate
      }
    },
    registerName () {
      if (this.address) {
        return `${this.address.prefix}${this.address.firstname}`
      }

      return ''
    },
    memberCount () {
      if (this.address) {
        if (this.address.membersCount) {
          return this.address.membersCount + 1
        } else {
          return 1
        }
      }
      return null
    }
  },
  watch: {
    search (val) {
      if (this.model === null || this.model === undefined) {
        this.isLoading = true

        axiosDB.get('/province.json?orderBy="address_key"&startAt="' + val + '"&limitToFirst=5')
          .then(res => {
            const idata = res.data
            const provinces = []
            Object.keys(idata).forEach(i => {
              const pro = idata[i]
              pro.id = i
              provinces.push(pro)
            })
            this.items = provinces
          })
          .catch(error => console.log(error))
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    model (val) {
      return firestoreApp.collection('dmjCampusRegister').doc(`${val}`).collection('usersCampus')
        .get()
        .then(res => {
          this.itemsLeader = []
          console.log(res.size)
          if (res.size > 0) {
            // check data fetch to dropdown
            let result = []
            res.forEach(x => {
              let a = x.data()
              a['userId'] = x.id
              result.push(a)
            })
            this.itemsLeader = result
          }
        })
        .catch(error => console.log(error))
    }
  },
  methods: {
    ...mapMutations('dmj', [
      'setUserInfo'
    ]),
    getProfile () {
      this.$liff
        .getProfile()
        .then(user => {
          this.setUserInfo(user)
        })
        .catch(error => alert(`Error getting Profile: ${error}`))
    },
    save (date) {
      this.$refs.menu.save(date)
    },
    onResize () {
      this.isMobile = window.innerWidth < 600
    },
    resetForm () {
      this.errorMessages = []
      // clear forms
      this.$refs.forms.reset()
    },
    submit () {
      // check form blanked to show Reset Form Button
      this.formHasErrors = false
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) {
          this.formHasErrors = true
        }
      })
      // if forms has validated!!!
      if (this.$refs.forms.validate()) {
        this.signupNewUser()
        // if send data finished!!  ++reset Form+
        this.dialog = true
      }
    },
    closeDialog () {
      this.resetForm()
      this.dialog = false
    },
    async signupNewUser () {
      const formData = this.form

      this.$store.dispatch('leader/insertMemberToDb', formData)
    },
    async saveDataToRTDB (data) {
      try {
        const userCenter = await axiosDB.post(`/rest/saving-data/fireblog/usersCenter.json?auth=${this.token}`, data)
        console.log(userCenter)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-row class="transparent" justify="center" v-show="!checkUserProfile">
        <v-col class="justify-space-around" cols="4">
          <v-btn large class="success" style="width: 100%;" rounded @click="getProfile">Login เพื่อคีย์ข้อมูล</v-btn>
        </v-col>
        <v-col v-show="false" cols="12" sm8 md6>
          <v-card id="profileinfo">
            <v-card-title><h2>Profile</h2></v-card-title>
            <div id="profilepicturediv"></div>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>userId</v-list-item-content>
                <v-list-item-content
                  class="align-end"
                  id="useridprofilefield"
                ></v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>displayName</v-list-item-content>
                <v-list-item-content
                  class="align-end"
                  id="displaynamefield"
                ></v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>statusMessage</v-list-item-content>
                <v-list-item-content
                  class="align-end"
                  id="statusmessagefield"
                ></v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>context.groupId</v-list-item-content>
                <v-list-item-content
                  class="align-end"
                  id="groupidfield"
                ></v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-card
        v-if="checkUserProfile"
        class="mx-auto"
        max-width="600"
      >
        <v-card-title>
          <v-col cols="3">
            <img src="@/assets/gCenterFavicon.png" height="48px"/>
          </v-col>
          <v-col v-if="isMobile">
            <p class="headline">{{ titleShort }}</p>
          </v-col>
          <v-col v-else>
            <p class="headline">{{ title }}</p>
          </v-col>
        </v-card-title>
        <span class="pa-4">
          <strong class="indigo--text">สำหรับคีย์ผลงาน ชวนสวดธรรมจักร 108 จบ</strong>
        </span>
        <p class="px-5">
          <br />
          โดยการพิมพ์เลือกชื่อศูนย์ที่สังกัด (ลงทะเบียนอำเภอ ตามที่ คณะทำงานส่งเสริมศีลธรรมจังหวัด มอบหมาย) พร้อมทั้งกรอกรายละเอียดทุกช่อง
        </p>
        <p class="px-5">
          เมื่อลงทะเบียนเสร็จครบจำนวน 10 ใบ 108 แล้วท่านสามารถแจ้ง admin เพื่อขอรหัสเข้าห้อง <strong class="green--text">LINE "ขุนพลธรรมจักร"</strong> เพื่อเข้าสู่การอบรมผู้นำฯ ต่อไป
        </p>
        <v-form ref="forms" lazy-validation>
          <v-card-text>
            <v-autocomplete
              v-model="model"
              :items="items"
              :loading="isLoading"
              :search-input.sync="search"
              :rules="[() => !!model || 'This field is required']"
              :error-messages="errorMessages"
              background-color="light-blue lighten-5"
              chips
              clearable
              hide-details
              hide-selected
              item-text="address_lv2_name"
              item-value="id"
              label="เลือกจังหวัดที่ตั้ง..."
              solo
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>
                    พิมพ์ชื่อศูนย์ตามอำเภอ
                    <strong>(ไม่ต้องพิมพ์"อำเภอ")</strong>
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template
                v-slot:selection="{ attr, item, on, selected }"
              >
                <v-chip
                  v-bind="attr"
                  :input-value="selected"
                  color="light-blue darken-2"
                  class="white--text"
                  v-on="on"
                >
                  <v-icon left>business</v-icon>
                  <span v-text="item.address_lv2_name"></span>
                </v-chip>
              </template>
              <template v-slot:item="{ item }">
                <v-list-item-avatar
                  color="indigo"
                  class="headline font-weight-light white--text"
                >
                  {{ item.address_key.charAt(0) }}
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="item.address_lv2_name"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-divider class="mt-3" dark></v-divider>
            <p/>
            <v-autocomplete
              v-model="address"
              :items="itemsLeader"
              :loading="isLoading2"
              :search-input.sync="searchLeader"
              :rules="[() => !!address || errorText]"
              :error-messages="errorMessages"
              background-color="blue-grey lighten-5"
              chips
              clearable
              hide-details
              hide-selected
              item-text="fullname"
              return-object
              label="ผู้ทำหน้าที่ชวนสวดธรรมจักร 108 จบ"
              filled
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>
                    พิมพ์ชื่อทีละตัว
                    <strong>(โดยไม่ต้องพิมพ์คำนำหน้า)</strong>
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template
                v-slot:selection="{ attr, item, on, selected }"
              >
                <v-chip
                  v-bind="attr"
                  :input-value="selected"
                  color="blue darken-3"
                  class="white--text"
                  v-on="on"
                >
                  <v-icon left>person</v-icon>
                  <span v-text="item.fullname"></span>
                </v-chip>
              </template>
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.fullname"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-divider class="mt-3" dark></v-divider>
            <p/>
            <v-card
              color="red lighten-5"
            >
              <v-card-title class="title">
                ใบ&nbsp;<span class="red--text">108 จบ</span>&nbsp;สวดธัมมจักกัปปวัตตนสูตร
              </v-card-title>
              <v-card-text>
                <v-text-field
                  ref="membername"
                  prepend-icon="person"
                  v-model="membername"
                  :rules="[() => !!membername || errorText]"
                  :error-messages="errorMessages"
                  label="ชื่อ"
                  required
                ></v-text-field>
                <v-radio-group
                  v-model="gender"
                  row
                  mandatory
                >
                  <v-radio label="ชาย" color="red" value="Male"></v-radio>
                  <v-radio label="หญิง" color="red" value="Female"></v-radio>
                </v-radio-group>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="birthDate"
                      label="วัน/เดือน/ปี เกิด"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="birthDate"
                    :max="new Date().toISOString().substr(0, 10)"
                    min="1927-01-01"
                    locale="th"
                    @change="save"
                  ></v-date-picker>
                </v-menu>
                <v-text-field
                  ref="telnumber"
                  v-model="telnumber"
                  label="เบอร์โทรศัพท์"
                  prepend-icon="local_phone"
                  mask="phone"
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-divider class="mt-4"></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-3" text @click="resetForm">เคลียร์ฟอร์มกรอก</v-btn>
            <v-spacer></v-spacer>
            <v-slide-x-reverse-transition>
              <v-tooltip
                v-if="formHasErrors"
                left
              >
                <v-btn
                  slot="activator"
                  icon
                  class="my-0"
                  @click="resetForm"
                >
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>Refresh form</span>
              </v-tooltip>
            </v-slide-x-reverse-transition>
            <v-btn color="blue darken-3" text @click="submit">ลงทะเบียน</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-text>
          <v-container grid-list-md>
            <v-row column wrap align-center>
              <v-col cols="12" sm6 md4>
                <span class="title">{{ registerName }} ได้ทำการส่งข้อมูลแล้ว!</span>
              </v-col>
              <v-col text-xs-center>
                <span>ตอนนี้คุณได้ชวนคนสวดธรรมจักร 108 จบแล้ว</span><br /><br />
                <span class="display-1 red--text">{{ memberCount }} คน</span><br /><br />
                <span class="headline red--text" v-if="memberCount > 9">ยินดีด้วยคุณได้ทำ<br>ภารกิจขั้นแรกสำเร็จแล้ว</span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click.native="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
