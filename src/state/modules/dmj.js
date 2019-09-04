import firebase from '@firebase/app'
import firestoreApp from '@/utils/firestore-config.js'

const state = {
  idToken: null,
  user: null,
  userInfo: {
    userId: null,
    displayName: null,
    pictureUrl: null,
    statusMessage: null
  }
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
  async insertDmjToDb ({ commit }, data) {
    const inputData = data
    let newUserCenter = null
    inputData['lastUpdated'] = getserverTimestamp()
    try {
      newUserCenter = await firestoreApp
        .collection('dmjUserCenter')
        .add(data)

      if (newUserCenter) {
        let campId = inputData.campusId
        await firestoreApp
          .collection('dmjCampusRegister')
          .doc(`${campId}`)
          .collection('usersCampus')
          .doc(newUserCenter.id)
          .set(inputData, { merge: true })
      }
    } catch (error) { console.log(error) }
  },
  async updateUser ({ commit }, { campId, id }) {
    const updatedData = {
      invited20dmj: true,
      lastUpdated: getserverTimestamp()
    }

    try {
      await firestoreApp.collection('dmjUserCenter')
        .doc(`${id}`)
        .set(updatedData, { merge: true })

      await firestoreApp
        .collection('dmjCampusRegister')
        .doc(`${campId}`)
        .collection('usersCampus')
        .doc(`${id}`)
        .set(updatedData, { merge: true })
    } catch (error) { console.log(error) }
  },
  insertInviterToDb ({ commit }, data) {
    return firestoreApp
      .collection('dmjInvitedWorks')
      .doc(`${data.dmjInviterId}`)
      .set(data, { merge: true })
  }
}

const getters = {
  getUser: state => state.userInfo,
  checkUserProfile: state => !!state.userInfo.displayName
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
