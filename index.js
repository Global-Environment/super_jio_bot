require('dotenv').config()
const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const usersMiddleware = require('./middleware/users')
<<<<<<< HEAD
const createRestaurantMiddleware = require('./middleware/create-restaurant')
=======
>>>>>>> e46af9aa6d486975993d24e9abae0273758c2ac1

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(usersMiddleware.createUser)

bot.start((ctx) => ctx.reply('Welcome to Super Jio!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

const mainMenu = new TelegrafInlineMenu(ctx => `Welcome to Super Jio, ${ctx.from.first_name}!`)
const restaurantMenu = new TelegrafInlineMenu(ctx =>  'Which restaurant would you like to order from?')

mainMenu.setCommand('start')

mainMenu.submenu('Start a Jio!', 'r', restaurantMenu)

mainMenu.simpleButton('Add new Restaurant', 'b',{
    doFunc: ctx => ctx.reply('Working On it....')
})

mainMenu.simpleButton('Statistics', 'c', {
    doFunc: ctx => ctx.reply('Working on it....')
})

<<<<<<< HEAD
bot.on('message', createRestaurantMiddleware.handle_message)

bot.launch()
=======
const restaurants = ['Al Amaans', 'McDonalds', 'Swee Choon']

restaurants.forEach(item => restaurantMenu.simpleButton(item, item, {
    doFunc: ctx => ctx.reply('Jio started!')
}))
>>>>>>> e46af9aa6d486975993d24e9abae0273758c2ac1

bot.launch()

bot.use(mainMenu.init({
    backButtonText: 'back…',
    mainMenuButtonText: 'Back to Main Menu'
}))
console.log('Telegram bot is active')
