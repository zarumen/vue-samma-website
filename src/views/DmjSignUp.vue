<script>
import axiosDB from '@/utils/axios-db.js'

export default {
  data () {
    return {
      title: 'ลงทะเบียน บ้านสวดธรรมจักร',
      titleShort: 'ลงทะเบียน บ้านสวดธรรมจักร',
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
        invitePerson: this.model,
        prefix: this.prefix,
        firstname: this.firstname,
        surname: this.surname,
        fullname: `${this.prefix}${this.firstname} ${this.surname}`,
        telnumber: this.telnumber,
        campusId: this.address.address_lv2_id,
        lineId: this.lineId,
        address: this.address
      }
    },
    registerName () {
      return `${this.prefix}${this.firstname}`
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
            console.log(adata)
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
    closeDialog () {
      this.resetForm()
      this.dialog = false
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
    async signupNewUser () {
      const formData = this.form

      this.$store.dispatch('dmj/insertDmjToDb', formData)

      // await axiosAuth.post(`/signupNewUser?key=${fConfig.apiKey}`, {
      //   email: this.email,
      //   password: this.telnumber,
      //   returnSecureToken: true
      // })
      //   .then(res => {
      //     console.log(res)
      //     token = res.data.idToken
      //     this.$store.dispatch('dmj/insertDmjToDb', formData)
      //     // this.saveDataToRTDB(formData)
      //   })
      //   .catch(error => console.log(error))
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
          <strong class="indigo--text">สำหรับลงทะเบียนเปิดบ้านสวดธรรมจักร</strong>
        </span>
        <p class="px-5">
          <br />
          เมื่อได้รับธรรมาวุธ พร้อมทั้งใบสมัครให้ กรอกรายละเอียดส่วนตัว เพื่อใช้ในการลงทะเบียนกับทางส่วนกลาง
        </p>
        <p class="px-5">
          เมื่อลงทะเบียนเสร็จแล้วท่านสามารถเข้าแอด <strong class="green--text">LINE กลุ่ม "บ้านสวดธรรมจักร"</strong> เพื่อสอบถามรายละเอียดกิจกรรมเพิ่มเติมต่อไป
        </p>
        <v-form ref="forms" lazy-validation>
          <v-card-text>
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
              ref="lineId"
              v-model="lineId"
              :rules="[() => !!lineId || errorText]"
              :error-messages="errorMessages"
              label="LINE ID สำหรับเข้ากลุ่ม บ้านสวดธรรมจักร"
              required
            ></v-text-field>
            <v-text-field
              v-model="model"
              label="ชื่อผู้ชวน"
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
              return-object
              item-text="address_name"
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
                <span>สำหรับผู้ที่ลงทะเบียนสามารถเข้าห้องไลน์ [บ้านสวดธรรมจักร] กลางเพื่อรับทราบข้อมูลข่าวสารได้ 2 ช่องทาง คือ </span>
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
