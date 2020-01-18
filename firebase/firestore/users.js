const {
    usersCollection
} = require('./firestore')
const { getAllFromCollection, getAllDocumentIds } = require('./common')

const getAllUsers = () => getAllFromCollection(usersCollection)

const getAllUserIds = () => getAllDocumentIds(usersCollection)

const getUser = (userDocId) => {
    return usersCollection.doc(`${userDocId}`)
}

const createUser = (userData) => new Promise(resolve => {
    const userId = userData.id
    getUser(userId).get().then(doc => {
        if (doc && doc.exists) {
            console.log(`User ${userId} exists returning existing user data.`)
            return resolve(doc.data())
        }
        const data = {
            joinDate: new Date(),
            name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            username: userData.username || null
        }
        getUser(userId).set(data)
            .then(() => {
                console.log(`New user created ${userId}.`)
                resolve(data)
            })
    })
})

const updateUser = (userId, userData) => {
    return getUser(`${userId}`).set(userData, { merge: true })
        .then(console.log(`Successfully updated user ${userId} data`))
}

module.exports = {
    getUser,
    updateUser,
    createUser,
    getAllUsers,
    getAllFromCollection
}
