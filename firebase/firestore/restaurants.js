const {
    restaurantCollection,
    firestore
} = require('./firestore')

const getRestaurant = (userDocId) => {
    return restaurantCollection.doc(`${userDocId}`)
}

const createRestaurantObject = (restaurant) => new Promise( resolve => {
    const restaurantName = restaurant.name
    getRestaurant(restaurantName).get().then(doc => {
        if (doc && doc.exists) {
            console.log(`User ${restaurantName} exists!`)
            return resolve(doc.data())
        }
        getRestaurant(restaurantName).set(restaurant).then( () => {
            console.log(`New restaurant ${restaurantName} created`)
            resolve(restaurant)
        })
    })
})

module.exports = {
    getRestaurant,
    createRestaurantObject
}
