import {MY_LOGO_STICKER} from '../../../constants.js';
import ChatIdSQL from '../../../db/chatIdSQL.js';
import {COMMAND} from '../../constants/tgBotConstants.js';
import QuoteSQL from "../../../db/quoteSQL.js";
import strings from "../../../constants/strings.js";

class TgBotUtilsImpl {
    constructor(bot, msg) {
        this.bot = bot;
        this.chatId = msg?.chat?.id;
        this.text = msg.text;
        this.msg = msg;
    }

    async getChatId() {
        await this.bot.sendMessage(this.chatId, this.chatId);
    }

    async start() {
        await this.bot.sendSticker(this.chatId, MY_LOGO_STICKER);
        await this.bot.sendMessage(
            this.chatId,
            `Добро пожаловать! =) \nЗдесь можно оставлять цитаты!\nДля того чтоб добавить цитату отправьте ее в чат с пометкой "©" и именем правообладателя, например ©Генадий Пупкин`,
        );
    }

    async info() {
        ChatIdSQL.findByChatId(this.msg.from.id, async (error, data) => {
            if (error) {
                await this.bot.sendMessage(this.chatId, `Ваши данные не найдены`);
                return;
            }
            if (data) {
                QuoteSQL.getCountByChatIdKey(data?.id, async (error, data) => {
                    if (error) {
                        await this.bot.sendMessage(
                            this.chatId,
                            strings.ups,
                        );
                        return;
                    }
                    await this.bot.sendMessage(
                        this.chatId,
                        `Количество цитат: <b>${data['COUNT(chatIdKey)']}</b>`,
                        {parse_mode: 'HTML'},
                    );
                })

            } else {
                await this.bot.sendMessage(
                    this.chatId,
                    `Вы не идентифицированный пользователь\nДля идентификации используйте команду: ` + COMMAND.START,
                );
            }
        });
    }

    async errorRequest() {
        await this.bot.sendMessage(this.chatId, `Я тебя не понимаю... Попробуй еще раз!`);
    }
}

export default TgBotUtilsImpl;
