const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

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

const restaurants = ['Al Amaans', 'McDonalds', 'Swee Choon']

restaurants.forEach(item => restaurantMenu.simpleButton(item, item, {
    doFunc: ctx => ctx.reply('Jio started!')
}))

bot.launch()

bot.use(mainMenu.init({
    backButtonText: 'back…',
    mainMenuButtonText: 'Back to Main Menu'
}))
console.log('Telegram bot is active')
