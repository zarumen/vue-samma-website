<script>
export default {
  data () {
    return {
      gradient: 'to top right, rgba(63,81,181, .7), rgba(25,32,72, .7)'
    }
  }
}
</script>

<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-row>
        <v-col cols="12">
          <v-img
            :gradient="gradient"
            height="550px"
            dark
            src="https://4.bp.blogspot.com/-G2vKn8cT65A/WzcMLrp6HsI/AAAAAAAAQ68/ay2dl8sQxo4NcQ_FPc6S-GVsHaRZmluawCLcBGAs/s1600/001.jpg"
          >
            <v-container fill-height>
              <v-row align-center class="lightbox white--text">
                <v-col class="text-center">
                  <img src="@/assets/gtuLogoWithText.png">
                  <h3 class="display-2">ชมรมกตัญญูบูชา</h3>
                  <v-divider class="my-3"></v-divider>
                  <h2>
                    <blockquote>
                      &#8220;สุโข ปุญฺญสฺส อุจฺจโย. การสั่งสมบุญนำสุขมาให้.&#8221;
                      <footer>
                        <small>
                          <em>&mdash;พุทธพจน์</em>
                        </small>
                      </footer>
                    </blockquote>
                  </h2>
                </v-col>
              </v-row>
            </v-container>
          </v-img>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="cyan lighten-5 pa-4">
            <v-row>
              <v-card-text>
                <v-col class="text-center">
                  <h2>สำหรับศูนย์ประสานงานอำเภอ (G-center)</h2>
                </v-col>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" text to="/centersignup">ลงทะเบียน</v-btn>
              </v-card-actions>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="red lighten-5 pa-4">
            <v-row class="align-center">
              <v-card-text>
                <v-col class="text-center">
                  <h2>สำหรับข้อมูลผู้นำสวดธรรมจักร</h2>
                </v-col>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="red">Click me!</v-btn>
              </v-card-actions>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-transition>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
v-card.promo {
  background: #f3f3f3
}
</style>
