const {restaurantCollection, firestore} = require('./firestore')
const { getAllFromCollection, getAllDocumentIds } = require('./common')

const getAll = () => getAllFromCollection(restaurantCollection)
const getAllRestaurantIds = () => getAllDocumentIds(restaurantCollection)

const getAllRestaurants = () => {
    return new Promise((resolve, reject) => {
        let events = [];
        const snapshot = restaurantCollection
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => events.push(doc.data()));
                return resolve(events); // return the events only after they are fetched
            })
            .catch(error => {
                reject(error);
            });
    });
};

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
    getAllRestaurants,
    getAllFromCollection,
    restaurantCollection,
    createRestaurantObject,
    firestore
}
