const { createUser } = require('../firebase/firestore/users')
const UserData = require('../data/user-data')

exports.createUser = async (ctx, next) => {
    if (ctx.message && ctx.message.text === '/start') {
        if (!UserData.checkUserExists(ctx.from.id)) {
            await createUser(ctx.from)
        }
    }
    UserData.updateUser(ctx.from.id)
    return next()
}
