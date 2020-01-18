const { CREATE_MENU_MESSAGES }  = require('../messages')
const { createRestaurantObject } = require('../firebase/firestore/restaurants')
const { Chance } = require('../Chance')

let menuName
let state
let category
let item
let categories = []

const createRestaurant = async (ctx, next) => {
    await ctx.reply(CREATE_MENU_MESSAGES.newMenuIntroduction)
    state = 'makeCategory1'
}

const createFirstCategory = async(ctx, next) => {
    if(ctx.message && ctx.message.text === '/cancel') {
        next()
    } else {
        ctx.reply(CREATE_MENU_MESSAGES.newCategoryIntroduction)
        menuName = ctx.message.text
        state = 'addItem1'
    }
}

const createFirstItem = async(ctx, next) => {
    if(ctx.message && ctx.message.text === '/cancel') {
        next()
    } else {
        ctx.reply(CREATE_MENU_MESSAGES.newItemIntroduction(ctx.message.text))
        category = {
            name: ctx.message.text,
            items: []
        }
        state = 'addItem1.1'
    }
}

const addFirstPrice = async(ctx, next) => {
    if(ctx.message && ctx.message.text === '/cancel') {
        next()
    } else {
        ctx.reply(CREATE_MENU_MESSAGES.newPriceIntroduction(ctx.message.text))
        item = {
            name: ctx.message.text,
            price: ''
        }
        state = 'addItem2'
    }
}

const createItem = async(ctx, next) => {
    if(ctx.message && ctx.message.text === '/cancel') {
        next()
    } else {
        ctx.reply(CREATE_MENU_MESSAGES.nextItem)
        //TODO: Add validation and trimming for price to ensure proper input
        item.price = ctx.message.text
        category.items.push(item)
        state = 'addItem2.1'
    }
}

const addPrice = async (ctx, next) => {
    if(ctx.message && ctx.message.text === '/cancel') {
        next()
    } else if (ctx.message && ctx.message.text === '/done') {
        await createCategory(ctx, next)
    } else {
        ctx.reply(CREATE_MENU_MESSAGES.newPriceIntroduction(ctx.message.text))
        item = {
            name: ctx.message.text,
            price: ''
        }
        state = 'addItem2.2'
    }
}

const createCategory = async(ctx, next) => {
    if(ctx.message && ctx.message.text === '/cancel') {
        next()
    } else {
        ctx.reply(CREATE_MENU_MESSAGES.nextCategory)
        categories.push(category)
        state = 'makeCategory2.1'
    }
}

const createItem2 = async (ctx, next) => {
    if(ctx.message && ctx.message.text === '/cancel') {
        next()
    } else if(ctx.message && ctx.message.text === '/done') {
        state = 'done'
        console.log(categories)
        console.log(menuName)
        console.log(categories[0].items)
        await createRestaurantObject({
            id: Chance.prototype.string(),
            userIds: [ctx.from.id],
            name: menuName,
            categories: categories
        })
        categories = []
        ctx.reply(`New Menu for ${menuName} has successfully been created!`)
    } else {
        ctx.reply(CREATE_MENU_MESSAGES.newItemIntroduction(ctx.message.text))
        category = {
            name: ctx.message.text,
            items: []
        }
        state = 'addItem1.1'
    }
}

exports.handle_message = async(ctx, next) => {
    if(ctx.message && ctx.message.text === '/newMenu') {
        await createRestaurant(ctx, next)
    } else if (state === 'makeCategory1') {
        await createFirstCategory(ctx, next)
    } else if (state === 'addItem1') {
        await createFirstItem(ctx, next)
    } else if (state === 'addItem1.1') {
        await addFirstPrice(ctx, next)
    } else if (state === 'addItem2') {
        await createItem(ctx, next)
    } else if (state === `addItem2.1`) {
        await addPrice(ctx, next)
    } else if (state === `addItem2.2`) {
        await createItem(ctx, next)
    } else if (state === 'makeCategory2.1') {
        await createItem2(ctx, next)
    } else {
        next()
    }

}
