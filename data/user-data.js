/**
 * Minimise calls to firestore by maintaining a list of
 * existing users in memory
 * TODO: maybe store and read from file
 */
const _ = require('lodash')
require('dotenv').config()

const insert = (array, el) => {
    array.splice(0, 0, el)
}

class UserDataSingleton {
    constructor () {
        this.existingUsers = []
        this.userLimit = +process.env.USER_LIMIT
    }

    checkUserExists (userId) {
        return !!_.find(this.existingUsers, u => u == userId)
    }

    isAtLimit () {
        return this.existingUsers.length === this.userLimit
    }

    insert (userId) {
        insert(this.existingUsers, userId)
    }

    addUser (userId) {
        if (this.isAtLimit()) {
            this.existingUsers.pop()
        }
        this.insert(userId)
    }

    updateUser (userId) {
        _.remove(this.existingUsers, u => u == userId)
        this.addUser(userId)
    }
}

module.exports = new UserDataSingleton()
