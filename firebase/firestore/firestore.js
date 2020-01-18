require('dotenv').config()
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const admin = require('firebase-admin')
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://super-jio-bot.firebaseio.com'
})

const firestore = admin.firestore()
const getCollection = (collectionName) => firestore.collection(collectionName)

module.exports = {
    usersCollection: getCollection('/users'),
    restaurantCollection: getCollection('/restaurant'),
    firestore
}
