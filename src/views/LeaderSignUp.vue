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
  <v-layout justify-center align-center>
    <v-flex xs12 sm10 md8 lg6>
      <v-flex class="transparent" v-show="!checkUserProfile">
        <v-btn large color="success" style="width: 90%;" round @click="getProfile">Login เพื่อคีย์ข้อมูล</v-btn>
        <v-flex v-show="false" xs12 sm8 md6>
          <v-card id="profileinfo">
            <v-card-title><h2>Profile</h2></v-card-title>
            <div id="profilepicturediv"></div>
            <v-list dense>
              <v-list-tile>
                <v-list-tile-content>userId</v-list-tile-content>
                <v-list-tile-content
                  class="align-end"
                  id="useridprofilefield"
                ></v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>displayName</v-list-tile-content>
                <v-list-tile-content
                  class="align-end"
                  id="displaynamefield"
                ></v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>statusMessage</v-list-tile-content>
                <v-list-tile-content
                  class="align-end"
                  id="statusmessagefield"
                ></v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>context.groupId</v-list-tile-content>
                <v-list-tile-content
                  class="align-end"
                  id="groupidfield"
                ></v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-flex>
      <v-card v-if="checkUserProfile">
        <v-card-title>
          <v-flex>
            <img src="@/assets/gCenterFavicon.png" height="48px"/>
          </v-flex>
          <v-flex v-if="isMobile">
            <p class="headline">{{ titleShort }}</p>
          </v-flex>
          <v-flex v-else>
            <p class="headline">{{ title }}</p>
          </v-flex>
        </v-card-title>
        <span class="pa-4">
          <strong class="indigo--text">สำหรับคีย์ผลงาน ชวนสวดธรรมจักร</strong>
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
              <template slot="no-data">
                <v-list-tile>
                  <v-list-tile-title>
                    พิมพ์ชื่อศูนย์ตามอำเภอ
                    <strong>(ไม่ต้องพิมพ์"อำเภอ")</strong>
                  </v-list-tile-title>
                </v-list-tile>
              </template>
              <template
                slot="selection"
                slot-scope="{ item, selected }"
              >
                <v-chip
                  :selected="selected"
                  color="light-blue darken-2"
                  class="white--text"
                >
                  <v-icon left>business</v-icon>
                  <span v-text="item.address_lv2_name"></span>
                </v-chip>
              </template>
              <template
                slot="item"
                slot-scope="{ item, tile }"
              >
                <v-list-tile-avatar
                  color="indigo"
                  class="headline font-weight-light white--text"
                >
                  {{ item.address_key.charAt(0) }}
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.address_lv2_name"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>fa-google</v-icon>
                </v-list-tile-action>
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
              box
            >
              <template slot="no-data">
                <v-list-tile>
                  <v-list-tile-title>
                    พิมพ์ชื่อทีละตัว
                    <strong>(โดยไม่ต้องพิมพ์คำนำหน้า)</strong>
                  </v-list-tile-title>
                </v-list-tile>
              </template>
              <template
                slot="selection"
                slot-scope="{ item, selected }"
              >
                <v-chip
                  :selected="selected"
                  color="blue darken-3"
                  class="white--text"
                >
                  <v-icon left>person</v-icon>
                  <span v-text="item.fullname"></span>
                </v-chip>
              </template>
              <template
                slot="item"
                slot-scope="{ item, tile }"
              >
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.fullname"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>fa-google</v-icon>
                </v-list-tile-action>
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
                  v-model="membername"
                  :rules="[() => !!membername || errorText]"
                  :error-messages="errorMessages"
                  label="ชื่อ"
                  required
                ></v-text-field>
                <v-radio-group v-model="gender" row>
                  <v-radio label="ชาย" value="Male"></v-radio>
                  <v-radio label="หญิง" value="Female"></v-radio>
                </v-radio-group>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
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
                  mask="phone"
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-divider class="mt-4"></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-3" flat @click="resetForm">เคลียร์ฟอร์มกรอก</v-btn>
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
            <v-btn color="blue darken-3" flat @click="submit">ลงทะเบียน</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout column wrap align-center>
              <v-flex xs12 sm6 md4>
                <span class="title">{{ registerName }} ได้ทำการส่งข้อมูลแล้ว!</span>
              </v-flex>
              <v-flex text-xs-center>
                <span>ตอนนี้คุณได้ชวนคนสวดธรรมจักร 108 จบแล้ว</span><br /><br />
                <span class="display-1 red--text">{{ memberCount }} คน</span><br /><br />
                <span class="headline red--text" v-if="memberCount > 9">ยินดีด้วยคุณได้ทำ<br>ภารกิจขั้นแรกสำเร็จแล้ว</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
