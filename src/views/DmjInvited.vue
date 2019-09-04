<script>
import axiosDB from '@/utils/axios-db.js'
import firestoreApp from '@/utils/firestore-config.js'

export default {
  data () {
    return {
      title: 'คีย์ผลงานชวนเปิดบ้านสวดธรรมจักร',
      titleShort: 'ผลงานชวนเปิดบ้านสวดธรรมจักร',
      errorText: 'กรุณากรอกข้อมูลในช่องที่กำหนด',
      isLoading: false,
      isLoading2: false,
      items: [],
      itemsLeader: [],
      dataFrom: '',
      model: null,
      search: null,
      searchAddress: null,
      searchLeader: null,
      errorMessages: '',
      formHasErrors: false,
      memberTemp1: null,
      memberTemp2: null,
      memberTemp3: null,
      memberTemp4: null,
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
    form () {
      return {
        campusId: this.model,
        dmjInviterId: this.address.userId,
        dmjInviterFullname: this.address.fullname,
        keyFrom: this.dataFrom,
        dmjInvitedInfo: {
          first: this.memberTemp1,
          second: this.memberTemp2,
          third: this.memberTemp3,
          fourth: this.memberTemp4
        }
      }
    },
    registerName () {
      if (this.address) {
        return `${this.address.prefix}${this.address.firstname}`
      }

      return ''
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
      const idInviter = this.form.dmjInviterId
      const idCampusInviter = this.form.campusId

      this.$store.dispatch('dmj/updateUser', {
        id: idInviter,
        campId: idCampusInviter
      })
      this.$store.dispatch('dmj/insertInviterToDb', formData)
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
  <v-layout justify-center>
    <v-flex xs12 sm10 md8 lg6>
      <v-card>
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
          <strong class="indigo--text">สำหรับคีย์ผลงาน ชวนเปิดบ้านสวดธรรมจักร</strong>
        </span>
        <p class="px-5">
          <br />
          กรอกผลงาน ที่ไปชวนเปิดบ้านสวดธรรมจักร ครบ 20 หลัง แต่คัดเลือกมาเฉพาะคนที่จะเป็นทีมงานผู้ช่วย 4 คนตามแบบฟอร์มข้างล่าง
          เมื่อกรอกเสร็จติดต่อรับพระของขวัญที่ผู้ประสานงานจังหวัด ในเดือนถัดไป
        </p>
        <v-form ref="forms" lazy-validation>
          <v-card-text>
            <v-radio-group v-model="dataFrom" row>
              <v-radio label="คีย์จากส่วนกลาง" value="ส่วนกลาง"></v-radio>
              <v-radio label="คีย์จากจังหวัด" value="จังหวัด"></v-radio>
            </v-radio-group>
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
              label="ชื่อผู้นำบ้านสวดธรรมจักร"
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
            <v-text-field
              v-model="memberTemp1"
              label="ชื่อผู้ช่วยคนที่ 1"
            ></v-text-field>
            <v-text-field
              v-model="memberTemp2"
              label="ชื่อผู้ช่วยคนที่ 2"
            ></v-text-field>
            <v-text-field
              v-model="memberTemp3"
              label="ชื่อผู้ช่วยคนที่ 3"
            ></v-text-field>
            <v-text-field
              v-model="memberTemp4"
              label="ชื่อผู้ช่วยคนที่ 4"
            ></v-text-field>
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
                <span class="headline">{{ registerName }}ได้ทำการลงทะเบียนแล้ว!</span>
              </v-flex>
              <v-flex>
                <span>สำหรับผู้ที่ลงทะเบียนสามารถเข้าห้องไลน์ G-center กลางเพื่อรับทราบข้อมูลข่าวสารได้ 2 ช่องทาง คือ </span>
              </v-flex>
              <v-flex>
                <span>-------กดที่ปุ่ม<strong class="indigo--text">สำหรับผู้ใช้มือถือ</strong> หรือ สแกน QRcode <strong class="indigo--text">สำหรับเว็บไซต์</strong>----------</span>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-btn color="green white--text" href="https://line.me/ti/g2/cmyRwDMCluG-qIBOa55lzg">เข้าร่วม LINE Group</v-btn>
              </v-flex>
              <v-responsive :aspect-ratio="1/0.5">
                <img src="@/assets/qrLineGroup.jpg"/>
              </v-responsive>
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
