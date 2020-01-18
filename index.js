require('dotenv').config()
const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const usersMiddleware = require('./middleware/users')
const {getAllRestaurants} = require('./firebase/firestore/restaurants')

main = async () => { const bot = new Telegraf(process.env.BOT_TOKEN)
    var ongoingJio = {false:null}

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


    mainMenu.setCommand('start')

    mainMenu.submenu('Start a Jio!', 'r', restaurantMenu)

    mainMenu.simpleButton('Add new Restaurant', 'b',{
        doFunc: ctx => ctx.reply('Working on it....')
    })

    mainMenu.simpleButton('Statistics', 'c', {
        doFunc: ctx => ctx.reply('Working on it....')
    })

    const restaurants = await getAllRestaurants()
    console.log(restaurants)

    restaurants.forEach(item => restaurantMenu.simpleButton(item.name, item.name, {
        doFunc: ctx => startJio(ctx, item)
    }))

    bot.launch()

    bot.use(mainMenu.init({
        backButtonText: 'back…',
        mainMenuButtonText: 'Back to Main Menu'
    }))
    console.log('Telegram bot is active')
}

main()
