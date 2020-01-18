require('dotenv').config()
const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const Markup = require('telegraf/markup')
const bot = new Telegraf(process.env.BOT_TOKEN)

require('dotenv').config()

const usersMiddleware = require('./middleware/users')
const {getAllRestaurants} = require('./firebase/firestore/restaurants')


main = async () => {

    var ongoingJio = {false:null}
    const createRestaurantMiddleware = require('./middleware/create-restaurant')

    const Telegram = require('telegraf/telegram')


    bot.use(usersMiddleware.createUser)

    bot.command('add', (ctx) => addCommand(ctx))
    bot.help((ctx) => ctx.reply('Send me a sticker'))
    bot.on('sticker', (ctx) => ctx.reply('👍'))
    bot.hears('hi', (ctx) => ctx.reply('Hey there'))

    function startJio(ctx, item) {
        if (ongoingJio.key) {
            ctx.reply("There is an ongoing jio for " + ongoingJio.value.name + "!")
        } else {
            ongoingJio.key = true;
            ongoingJio.value = item;
            ctx.reply("Jio started!")
        }
    }

    function addCommand(ctx) {
        if (!ongoingJio.key) {
            ctx.reply("There are no ongoing jios!")
        } else {

        }
    }


    const mainMenu = new TelegrafInlineMenu(ctx => `Welcome to Super Jio, ${ctx.from.first_name}!`)
    const restaurantMenu = new TelegrafInlineMenu(ctx =>  'Which restaurant would you like to order from?')
    // Replace the String below with a function that lists out all users who haven't paid yet
    const paymentMenu = new TelegrafInlineMenu(ctx => 'People who have yet to pay:\n')

    mainMenu.setCommand('start')


    mainMenu.submenu('Start a Jio!', 'r', restaurantMenu)


    mainMenu.simpleButton('Add new Restaurant', 'b',{
        doFunc: ctx => ctx.reply('Working on it....')
    })

    bot.on('message', createRestaurantMiddleware.handle_message)


    mainMenu.simpleButton('Statistics', 'c', {
        doFunc: ctx => ctx.reply('Working on it....')
    })


    const restaurants = await getAllRestaurants()

    restaurants.forEach(item => restaurantMenu.simpleButton(item.name, item.name, {
        doFunc: ctx => startJio(ctx, item)
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

    bot.launch()

    bot.use(mainMenu.init({
        backButtonText: 'back…',
        mainMenuButtonText: 'Back to Main Menu'
    }))
    console.log('Telegram bot is active')
}

main()
