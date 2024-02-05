import TelegramApi from 'node-telegram-bot-api';
import {BUTTON_COMMANDS, COMMAND, tgBotDisplayCommands} from './constants/tgBotConstants.js';
import TgBotQuoteImpl from './implementations/reqest/tgBotQuoteImpl.js';
import TgBotUtilsImpl from './implementations/reqest/tgBotUtilsImpl.js';
import TgBotQuotaCallback from "./implementations/buttonsCallback/tgBotQuotaCallback.js";
import tgBotUtilCallback from "./implementations/buttonsCallback/tgBotUtilCallback.js";
import {BOT_NAME} from "../index.js";


const tgBot = (token) => {
    const bot = new TelegramApi(token, {polling: true});
    bot.setMyCommands(tgBotDisplayCommands).then();
    bot.on('message', async (msg) => {
        const text = msg?.text;
        const quotes = new TgBotQuoteImpl(bot, msg);
        const utils = new TgBotUtilsImpl(bot, msg);

        console.log('msg');
        console.log(msg);

        //QUOTES////////////////////////////////////////////////////////////////////////////////////////////////////
        if (text?.includes("©")) {
            await quotes.add();
            return
        }
        if (text?.slice(0, 7) === COMMAND.SEARCH) {
            await quotes.find();
            return;
        }
        if (text?.slice(0, 7) === COMMAND.DELETE) {
            await quotes.deleteQuote();
            return;
        }
        if (text === COMMAND.GET_RAND_QUOTE || text === COMMAND.GET_RAND_QUOTE + BOT_NAME) {
            await quotes.getRandom();
            return;
        }

        //COMMON////////////////////////////////////////////////////////////////////////////////////////////////////

        if (text === COMMAND.START || text === COMMAND.START + BOT_NAME) {
            await utils.start();
            return;
        }
        if (text === COMMAND.INFO || text === COMMAND.INFO + BOT_NAME) {
            await utils.info()
            return;
        }
        if (text === COMMAND.CHAT_ID || text === COMMAND.CHAT_ID + BOT_NAME) {
            await utils.getChatId()
        }
    });

    bot.on('callback_query', async (msg) => {
        let data;
        const chatId = msg?.message?.chat?.id;

        try {
            data = JSON.parse(msg?.data);
        } catch (error) {
            data = {};
        }
        const categoriesCallback = new TgBotQuotaCallback(bot, msg, data);
        const utilCallback = new tgBotUtilCallback(bot, msg, data);
        if (data.command === BUTTON_COMMANDS.DELETE_QUOTE) {
            await categoriesCallback.delete(chatId)
            return;
        }
        await utilCallback.error()
    });
    return bot
};
export default tgBot;
