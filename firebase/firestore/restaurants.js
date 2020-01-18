const {
    restaurantCollection
} = require('./firestore')
const { getAllFromCollection, getAllDocumentIds } = require('./common')

const getAll = () => getAllFromCollection(restaurantCollection)
const getAllRestaurantIds = () => getAllDocumentIds(restaurantCollection)

const getRestaurant = (resDocId) => {
    return restaurantCollection.doc(`${resDocId}`)
}

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


module.exports = {
    getRestaurant,
    getAllRestaurants,
    getAllFromCollection
}
