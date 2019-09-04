import firebase from '@firebase/app'
import firestoreApp from '@/utils/firestore-config.js'

const state = {}

const mutations = {}

const actions = {
  async insertMemberToDb ({ commit }, data) {
    const memberTx = data
    const leaderId = data.leaderId
    memberTx['lastUpdated'] = getserverTimestamp()
    let newMemberCenter = null
    try {
      newMemberCenter = await firestoreApp
        .collection('dmjMemberWorks')
        .add(memberTx)

      if (newMemberCenter) {
        await firestoreApp
          .collection('dmjUserCenter')
          .doc(`${leaderId}`)
          .collection('members')
          .doc(newMemberCenter.id)
          .set(memberTx, { merge: true })
      }
    } catch (error) { console.log(error) }
  }
}

const getters = {}

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
