import firebase from '@firebase/app'
import firestoreApp from '@/utils/firestore-config.js'

const state = {
  idToken: null,
  user: null,
  userInfo: {}
}

const mutations = {
  setIdToken (state, payload) {
    state.idToken = payload
  },
  setUser (state, payload) {
    state.user = payload
  },
  setUserInfo (state, payload) {
    state.userInfo = payload
  }
}

const actions = {
  updateUser ({ commit }, { user, token }) {
    commit('setIdToken', token)
    commit('setUser', user)
  },
  logout ({ commit }) {
    commit('setIdToken', null)
    commit('setUser', {})
  },
  async insertCenterToDb ({ commit }, data) {
    const inputData = data
    try {
      const newUserCenter = await firestoreApp
        .collection('usersCenter')
        .add(data)
        .then(docRef => {
          docRef.update({
            lastUpdated: getserverTimestamp(),
            id: docRef.id
          })
          inputData['id'] = docRef.id
          commit('setUserInfo', inputData)
        })

      let campusRegister = {}
      let campId = inputData.campusId
      campusRegister[inputData.id] = true
      const campRegis = await firestoreApp
        .collection('campusRegister')
        .doc(campId)
        .set(campusRegister, {merge: true})
      console.log(campRegis)
      console.log(newUserCenter)
    } catch (error) { console.log(error) }
  }
}

const getters = {
  getUsername () {
    return state.userInfo.prefix + state.userInfo.firstname
  }
}

function getserverTimestamp () {
  return firebase.firestore.FieldValue.serverTimestamp()
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
