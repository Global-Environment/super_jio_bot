require('dotenv').config()
const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const Markup = require('telegraf/markup')
const {getAllRestaurants} = require('./firebase/firestore/restaurants')
const bot = new Telegraf(process.env.BOT_TOKEN)

require('dotenv').config()

const usersMiddleware = require('./middleware/users')
const createRestaurantMiddleware = require('./middleware/create-restaurant')
const server = require('./server')
const { getUserMenu } = require('./firebase/firestore/restaurants')
const Telegram = require('telegraf/telegram')


const mainMenu = new TelegrafInlineMenu(ctx => `Welcome to Super Jio, ${ctx.from.first_name}!`)
const restaurantMenu = new TelegrafInlineMenu(async ctx =>  {
    const userId = ctx.from.id
    const restaurants = getUserMenu(userId)
    await restaurants.forEach(item => restaurantMenu.simpleButton(item, item, {
        doFunc: ctx => ctx.reply('Jio started!')
    }))

    await restaurants.forEach(item => shareMenu.simpleButton(item.name, item.id, {
        doFunc : ctx => ctx.reply(`Url is : http://127.0.0.1:3000/addMenu/${item.id}/${userId}`)
    }))
    return 'Which restaurant would you like to order from?'})
const shareMenu = new TelegrafInlineMenu(ctx => 'Which menu do you want to share?')
//
// bot.use(initButtons = async(ctx, next) => {
//     const userId = ctx.from.id
//     const restaurants = getUserMenu(userId)
//     restaurants.forEach(item => restaurantMenu.simpleButton(item, item, {
//         doFunc: ctx => ctx.reply('Jio started!')
//     }))
//
//     restaurants.forEach(item => shareMenu.simpleButton(item.name, item.id, {
//         doFunc : ctx => ctx.reply(`Url is : http://127.0.0.1:3000/addMenu/${item.id}/${userId}`)
//     }))
//     next()
// })


const main = async () => {

    const ongoingJio = {false:null}
    bot.use(usersMiddleware.createUser)

    bot.command('add', (ctx) => addCommand(ctx))

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
    // Replace the String below with a function that lists out all users who haven't paid yet
    const paymentMenu = new TelegrafInlineMenu(ctx => 'People who have yet to pay:\n')

    mainMenu.setCommand('start')
    mainMenu.submenu('Start a Jio!', 'r', restaurantMenu)
    mainMenu.submenu('Share your Menus!', 's', shareMenu)
    restaurantMenu.submenu('Display Payment Message!', 'd', paymentMenu)

    bot.on('message', createRestaurantMiddleware.handle_message)

    mainMenu.simpleButton('Statistics', 'c', {
        doFunc: ctx => ctx.reply('Working on it....')
    })

    const restaurants = await getAllRestaurants()

    // restaurants.forEach(item => restaurantMenu.simpleButton(item.name, item.name, {
    //     doFunc: ctx => startJio(ctx, item)
    // }))
    //
    // restaurants.forEach(item => shareMenu.simpleButton(item.name, item.id, {
    //     doFunc : ctx => ctx.reply(`Url is : http://127.0.0.1:3000/addMenu/${item.id}/${ctx.from.id}`)
    // }))

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
server.server()
