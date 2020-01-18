const { addUser } = require('./firebase/firestore/restaurants')

const express = require('express')

const app = express()
const port = process.env.PORT || 5000

exports.server = (next) => {
    app.get('/addMenu/:menuId/:userId', function (req, res, next) {
        const menuId = req.params.menuId
        const userId = req.params.userId
        addUser(menuId, userId, next)
    })

    app.listen(port)
    console.log('App listening at port ' + port)
}

