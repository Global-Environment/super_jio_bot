const {
    restaurantCollection,
    firestore
} = require('./firestore')

const getRestaurant = (userDocId) => {
    return restaurantCollection.doc(`${userDocId}`)
}

const createRestaurantObject = (restaurant) => new Promise( resolve => {
    const menuId = restaurant.id
    getRestaurant(menuId).get().then(doc => {
        if (doc && doc.exists) {
            console.log(`User ${menuId} exists!`)
            return resolve(doc.data())
        }
        getRestaurant(menuId).set(restaurant).then( () => {
            console.log(`New restaurant ${menuId} created`)
            resolve(restaurant)
        })
    })
})

const addUser  = (menuId, userId, next) => {
    getRestaurant(menuId).get().then( doc => {
        if(!doc || !doc.exists) {
            console.log('The requested menu doesnt exist!')
            next()
        }
        const data = doc.data()
        console.log(data)
        data.userIds.push(userId)
        getRestaurant(menuId).set(data).then(() => {
            console.log(`User ${userId} added to Menu ${menuId}`)
        })
    })
}

const getUserMenu = (userId) => {
    const userMenus = []
    let query = restaurantCollection.where('userIds', 'array-contains', userId)
        .get().then(snapshot => {
            if(snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            snapshot.forEach(doc => {
                console.log(doc.data());
                userMenus.push(doc.data())
            });
        })
    return userMenus
}

module.exports = {
    getRestaurant,
    createRestaurantObject,
    addUser,
    getUserMenu
}
