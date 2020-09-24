'use strict'

const admin = require('firebase-admin')
const functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var serviceAccount = require('./service-account.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://summaarahang.firebaseio.com'
})

admin.firestore().settings({ timestampsInSnapshots: true })

// Get Google Sheets instance
const { google } = require('googleapis')
const sheets = google.sheets('v4')

// Create JWT
const jwtClient = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'] // read and write sheets
})

// Get data from RTDB
exports.copyPetrolToSheet = functions.database.ref('/userCenters').onUpdate(async change => {
  let data = change.after.val()
  console.log(data)
  // Convert JSON to Array following structure below
  /*
  [
    ['COL-A', 'COL-B'],
    ['COL-A', 'COL-B']
  ]
  */
  var itemArray = []
  var valueArray = []
  Object.keys(data).forEach((key, index) => {
    itemArray.push(key)
    itemArray.push(data[key])
    valueArray[index] = itemArray
    itemArray = []
  })

  let maxRange = valueArray.length + 1

  // Do authorization
  await jwtClient.authorize()

  // Create Google Sheets request
  let request = {
    auth: jwtClient,
    spreadsheetId: '19_bUcpmJqkYpdLE52cz7SavBaXAEuLU_9ZcOi9rt3iA',
    range: 'Pivot Table 1!A2:B' + maxRange,
    valueInputOption: 'RAW',
    requestBody: {
      values: valueArray
    }
  }

  // Update data to Google Sheets
  await sheets.spreadsheets.values.update(request, {})
})

exports.aggregateUserTransactions = functions.firestore
  .document('dmjCampusRegister/{campusId}/usersCampus/{txId}')
  .onWrite((change, context) => {
    // const txId = context.params.txId;
    const campusId = context.params.campusId

    // ref to the parent document
    const docRef = admin
      .firestore()
      .collection('dmjCampusRegister')
      .doc(campusId)

    // get all comments and aggregate
    return docRef
      .collection('usersCampus')
      .orderBy('lastUpdated', 'desc')
      .get()
      .then(querySnapshot => {
        // get the total comment count
        const usersCount = querySnapshot.size

        const allTransactions = []
        let recentTransactions = []

        // add data from the 5 most recent comments to the array
        querySnapshot.forEach(doc => {
          allTransactions.push(doc.data())
        })

        let allUsers = allTransactions.map(member => member.fullname)
        let uniqueUsers = [...new Set(allUsers)]

        recentTransactions = allTransactions.slice(0, 5)

        // data to update on the document
        const data = {
          uniqueUsers,
          recentTransactions,
          usersCount
        }

        // run update
        return docRef.set(data, { merge: true })
      })
      .catch(err => console.log(err))
  })

exports.aggregateMemberTransactions = functions.firestore
  .document('dmjUserCenter/{userId}/members/{txId}')
  .onWrite((change, context) => {
    const txId = context.params.txId
    const userId = context.params.userId
    const data = change.after.data()

    const db = admin.firestore()
    const batch = db.batch()

    const docRef = db
      .collection('dmjUserCenter')
      .doc(userId)
    
    const campusRef = db
      .collection('dmjCampusRegister')
      .doc(`${data.campusId}`)
      .collection('usersCampus')
      .doc(`${userId}`)
    
    return docRef
      .collection('members')
      .orderBy('lastUpdated', 'desc')
      .get()
      .then(querySnapshot => {
        const membersCount = querySnapshot.size
        console.log(membersCount)
        const allTransactions = []

        querySnapshot.forEach(doc => {
          allTransactions.push(doc.data())
        })

        let allMembers = allTransactions.map(member => member.memberName)

        let updateData = {
          membersCount,
          allMembers
        }

        // set in Parent Ref
        batch.set(docRef, updateData, { merge: true })
        // set in Campus Ref
        batch.set(campusRef, updateData, { merge: true })

        return batch.commit()
          .then(() => {
            console.log('Updated Finished!')
          }).catch(err => console.log(err))
      })
  })
