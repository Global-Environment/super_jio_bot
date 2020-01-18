require('dotenv').config()
const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const usersMiddleware = require('./middleware/users')


const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(usersMiddleware.createUser)

bot.start((ctx) => ctx.reply('Welcome to Super Jio!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

const mainMenu = new TelegrafInlineMenu(ctx => `Hi ${ctx.from.first_name}!`)

mainMenu.setCommand('start')

mainMenu.simpleButton('Start a Jio!', 'a', {
    doFunc: ctx => ctx.reply('Working On it....')
})

mainMenu.simpleButton('Add new Restaurant', 'b',{
    doFunc: ctx => ctx.reply('Working On it....')
})

mainMenu.simpleButton('Statistics', 'c', {
    doFunc: ctx => ctx.reply('Working on it....')
})

bot.launch()

bot.use(mainMenu.init())

console.log('Telegram bot is active')
