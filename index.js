require('dotenv').config()
const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const usersMiddleware = require('./middleware/users')
const createRestaurantMiddleware = require('./middleware/create-restaurant')
const server = require('./server')
const { getUserMenu } = require('./firebase/firestore/restaurants')

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

bot.use(mainMenu.init({
    backButtonText: 'back…',
    mainMenuButtonText: 'Back to Main Menu'
}))

bot.startPolling()
console.log('Telegram bot is active')

server.server()
