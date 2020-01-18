require('dotenv').config()
const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')

const Markup = require('telegraf/markup')
require('dotenv').config()

const usersMiddleware = require('./middleware/users')
const createRestaurantMiddleware = require('./middleware/create-restaurant')
const server = require('./server')
const { getUserMenu } = require('./firebase/firestore/restaurants')
const Telegram = require('telegraf/telegram')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(usersMiddleware.createUser)

const mainMenu = new TelegrafInlineMenu(ctx => `Welcome to Super Jio, ${ctx.from.first_name}!`)
const restaurantMenu = new TelegrafInlineMenu(ctx =>  'Which restaurant would you like to order from?')
const shareMenu = new TelegrafInlineMenu(ctx => 'Which menu do you want to share?')
bot.use(initButtons = async(ctx, next) => {
    const userId = ctx.from.id
    const restaurants = getUserMenu(userId)
    restaurants.forEach(item => restaurantMenu.simpleButton(item, item, {
        doFunc: ctx => ctx.reply('Jio started!')
    }))

    restaurants.forEach(item => shareMenu.simpleButton(item.name, item.id, {
        doFunc : ctx => ctx.reply(`Url is : http://127.0.0.1:3000/addMenu/${item.id}/${userId}`)
    }))
    next()
})

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))


// Replace the String below with a function that lists out all users who haven't paid yet
const paymentMenu = new TelegrafInlineMenu(ctx => 'People who have yet to pay:\n')

mainMenu.setCommand('start')

mainMenu.submenu('Start a Jio!', 'r', restaurantMenu)

mainMenu.submenu('Choose which menu you want to share!', 's', shareMenu)

mainMenu.simpleButton('Add new Restaurant', 'b',{
    doFunc: ctx => ctx.reply('Working On it....')
})

mainMenu.simpleButton('Statistics', 'c', {
    doFunc: ctx => ctx.reply('Working on it....')
})

bot.on('message', createRestaurantMiddleware.handle_message)

const restaurants = ['Al Amaans', 'McDonalds', 'Swee Choon']

restaurants.forEach(item => restaurantMenu.simpleButton(item, item, {
    doFunc: ctx => ctx.reply('Jio started!')
}))

restaurantMenu.submenu('Display Payment Message!', 'd', paymentMenu)

const telegram = new Telegram("921913620:AAHLeb6KTsfzUpSQhXT1wCen9uvMc8CEghk", null, true)

function test(ctx) {
    ctx.editMessageText("@" + ctx.from.username + " has paid!")
    // ctx.editMessageReplyMarkup(Markup.inlineKeyboard([Markup.callbackButton('Paid!', ctx.from.username)]))
}

paymentMenu.simpleButton('I have paid!', 'p', {
    doFunc: (ctx) => test(ctx)
})

bot.use(mainMenu.init({
    backButtonText: 'back…',
    mainMenuButtonText: 'Back to Main Menu'
}))

bot.startPolling()
console.log('Telegram bot is active')

server.server()
