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
      <v-layout row wrap>
        <v-flex xs12>
          <v-img
            :gradient="gradient"
            height="550px"
            dark
            src="https://4.bp.blogspot.com/-G2vKn8cT65A/WzcMLrp6HsI/AAAAAAAAQ68/ay2dl8sQxo4NcQ_FPc6S-GVsHaRZmluawCLcBGAs/s1600/001.jpg"
          >
            <v-container fill-height>
              <v-layout align-center class="lightbox white--text">
                <v-flex text-xs-center>
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
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
        </v-flex>
        <v-flex xs12 md6>
          <v-card class="cyan lighten-5 pa-4">
            <v-layout align-center justify-center column wrap>
              <v-card-text>
                <v-flex class="text-md-center">
                  <h2>สำหรับศูนย์ประสานงานอำเภอ (G-center)</h2>
                </v-flex>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" to="/centersignup">ลงทะเบียน</v-btn>
              </v-card-actions>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs12 md6>
          <v-card class="red lighten-5 pa-4">
            <v-layout align-center justify-center column wrap>
              <v-card-text>
                <v-flex class="text-md-center">
                  <h2>สำหรับชมรมกตัญญูบูชา (G-club)</h2>
                </v-flex>
              </v-card-text>
              <v-card-actions>
                <!-- <v-btn color="accent">Click me!</v-btn>
                <v-btn color="accent">Click me!</v-btn> -->
              </v-card-actions>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
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
