<script>
import { fConfig } from '@/utils/f-config.js'
import axiosAuth from '@/utils/axios-auth.js'
import axiosDB from '@/utils/axios-db.js'

export default {
  data () {
    return {
      title: 'ลงทะเบียน คณะทำงานส่งเสริมศีลธรรมอำเภอ',
      titleShort: 'ลงทะเบียน คทง.สศ.อำเภอ',
      errorText: 'กรุณากรอกข้อมูลในช่องที่กำหนด',
      isLoading: false,
      isLoading2: false,
      items: [],
      itemsAddress: [],
      model: null,
      search: null,
      searchAddress: null,
      errorMessages: '',
      formHasErrors: false,
      prefix: null,
      firstname: null,
      surname: null,
      telnumber: null,
      email: null,
      fullname: null,
      lineId: null,
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
        prefix: this.prefix,
        firstname: this.firstname,
        surname: this.surname,
        telnumber: this.telnumber,
        email: this.email,
        lineId: this.lineId,
        addressId: this.address
      }
    },
    registerName () {
      return this.$store.getters['center/getUsername']
    }
  },
  watch: {
    search (val) {
      if (this.model === null || this.model === undefined) {
        this.isLoading = true

        axiosDB.get('/campus.json?orderBy="key"&startAt="' + val + '"&limitToFirst=5')
          .then(res => {
            const idata = res.data
            const campus = []
            Object.keys(idata).forEach(i => {
              const camp = idata[i]
              camp.id = i
              campus.push(camp)
            })
            this.items = campus
          })
          .catch(error => console.log(error))
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    searchAddress (val2) {
      if (this.address === null || this.address === undefined) {
        this.isLoading2 = true
        axiosDB.get('/address.json?orderBy="address_key"&startAt="' + val2 + '"&limitToFirst=5')
          .then(res => {
            const adata = res.data
            const addressArray = []
            Object.keys(adata).forEach(a => {
              const receiveAddress = adata[a]
              receiveAddress.id = a
              addressArray.push(receiveAddress)
            })
            this.itemsAddress = addressArray
          })
          .catch(error => console.log(error))
          .finally(() => {
            this.isLoading2 = false
          })
      }
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
        this.resetForm()
        this.dialog = true
      }
    },
    async signupNewUser () {
      const formData = this.form
      let token = null

      await axiosAuth.post(`/signupNewUser?key=${fConfig.apiKey}`, {
        email: this.email,
        password: this.telnumber,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          token = res.data.idToken
          let user = res.data.email
          this.$store.dispatch('center/updateUser', { token, user })
          this.$store.dispatch('center/insertCenterToDb', formData)
          // this.saveDataToRTDB(formData)
        })
        .catch(error => console.log(error))
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
          <strong class="indigo--text">สำหรับลงทะเบียนคณะทำงานประจำอำเภอ</strong>
        </span>
        <p class="px-5">
          <br />
          โดยการพิมพ์เลือกชื่อศูนย์ที่สังกัด (ลงทะเบียนอำเภอ ตามที่ คณะทำงานส่งเสริมศีลธรรมจังหวัด มอบหมาย) พร้อมทั้งกรอกรายละเอียดทุกช่อง
        </p>
        <p class="px-5">
          เมื่อลงทะเบียนเสร็จแล้วท่านสามารถเข้าห้อง <strong class="green--text">LINE "G-center"</strong> เพื่อสอบถามรายละเอียดเพิ่มเติมต่อไป
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
              item-text="campus_name"
              item-value="id"
              label="เลือกศูนย์ตามอำเภอ..."
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
                  <span v-text="item.campus_name"></span>
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
                  {{ item.campus_name.charAt(0) }}
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.campus_name"></v-list-tile-title>
                  <v-list-tile-sub-title v-text="item.province_name"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>fa-google</v-icon>
                </v-list-tile-action>
              </template>
            </v-autocomplete>
            <v-divider class="mt-3" dark></v-divider>
            <v-text-field
              ref="prefix"
              v-model="prefix"
              :rules="[() => !!prefix || errorText]"
              :error-messages="errorMessages"
              label="คำนำหน้า"
              required
            ></v-text-field>
            <v-text-field
              ref="firstname"
              v-model="firstname"
              :rules="[() => !!firstname || errorText]"
              :error-messages="errorMessages"
              label="ชื่อ"
              required
            ></v-text-field>
            <v-text-field
              ref="surname"
              v-model="surname"
              :rules="[() => !!surname || errorText]"
              :error-messages="errorMessages"
              label="นามสกุล หรือ ฉายา"
              required
            ></v-text-field>
            <v-text-field
              ref="telnumber"
              v-model="telnumber"
              :rules="[() => !!telnumber || errorText]"
              :error-messages="errorMessages"
              label="เบอร์โทรศัพท์"
              mask="phone"
              required
            ></v-text-field>
            <v-text-field
              ref="email"
              v-model="email"
              :rules="[v => !!v || errorText, v => /.+@gmail.com/.test(v) || 'กรุณาใส่เป็น G-mail (test@gmail.com)']"
              :error-messages="errorMessages"
              label="Email"
              required
            ></v-text-field>
            <v-text-field
              ref="lineId"
              v-model="lineId"
              :rules="[() => !!lineId || errorText]"
              :error-messages="errorMessages"
              label="LINE ID สำหรับเข้ากลุ่ม G-center"
              required
            ></v-text-field>
            <p/>
            <v-autocomplete
              v-model="address"
              :items="itemsAddress"
              :loading="isLoading2"
              :search-input.sync="searchAddress"
              :rules="[() => !!address || errorText]"
              :error-messages="errorMessages"
              background-color="blue-grey lighten-5"
              chips
              clearable
              hide-details
              hide-selected
              item-text="address_name"
              item-value="id"
              label="ที่อยู่"
              box
            >
              <template slot="no-data">
                <v-list-tile>
                  <v-list-tile-title>
                    พิมพ์อำเภอที่ตั้ง
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
                  color="blue darken-3"
                  class="white--text"
                >
                  <v-icon left>home</v-icon>
                  <span v-text="item.address_name"></span>
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
                  <v-list-tile-title v-text="item.address_lv3_name"></v-list-tile-title>
                  <v-list-tile-sub-title v-text="item.address_lv2_name"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>fa-google</v-icon>
                </v-list-tile-action>
              </template>
            </v-autocomplete>
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
                <v-btn color="green white--text" href="https://line.me/R/ti/g/7ruFaWVx8O">เข้าร่วม LINE Group</v-btn>
              </v-flex>
              <v-responsive :aspect-ratio="1/0.5">
                <img src="@/assets/qrLineGroup.png"/>
              </v-responsive>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
