import firebase from '@firebase/app'
import '@firebase/firestore'
import { fConfig } from './f-config.js'

const firebaseApp = firebase.initializeApp(fConfig)

firebaseApp.firestore().settings({ timestampsInSnapshots: true })

export default firebaseApp.firestore()
