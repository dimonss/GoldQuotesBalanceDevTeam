import {MY_LOGO_STICKER} from '../../../constants.js';
import ChatIdSQL from '../../../db/chatIdSQL.js';
import QuoteSQL from "../../../db/quoteSQL.js";
import strings from "../../../constants/strings.js";

class TgBotUtilsImpl {
    constructor(bot, msg) {
        this.bot = bot;
        this.chatId = msg?.chat?.id;
        this.text = msg.text;
        this.msg = msg;
        this.message_thread_id = msg?.message_thread_id ? {message_thread_id: msg?.message_thread_id} : {};
    }

    async getChatId() {
        await this.bot.sendMessage(this.chatId, this.chatId, this.message_thread_id);
    }

    async start() {
        await this.bot.sendSticker(this.chatId, MY_LOGO_STICKER, this.message_thread_id);
        await this.bot.sendMessage(
            this.chatId,
            `Добро пожаловать! =) \nЗдесь можно оставлять цитаты!\nДля того чтоб добавить цитату отправьте ее в чат с пометкой "©" и именем правообладателя, например ©Генадий Пупкин`,
            this.message_thread_id,
        );
    }

    async info() {
        ChatIdSQL.findByChatId(this.msg.from.id, async (error, data) => {
            if (error) {
                await this.bot.sendMessage(this.chatId, `Ваши данные не найдены`, this.message_thread_id);
                return;
            }
            if (data) {
                QuoteSQL.getCountByChatIdKey(data?.id, async (error, data) => {
                    if (error) {
                        await this.bot.sendMessage(
                            this.chatId,
                            strings.ups,
                            this.message_thread_id,
                        );
                        return;
                    }
                    await this.bot.sendMessage(
                        this.chatId,
                        `Количество цитат: <b>${data['COUNT(chatIdKey)']}</b>`,
                        {
                            parse_mode: 'HTML', ...this.message_thread_id,
                        },
                    );
                })

            } else {
                await this.bot.sendMessage(
                    this.chatId,
                    `У вас нет цитат`,
                    this.message_thread_id,

                );
            }
        });
    }

    // async errorRequest() {
    //     await this.bot.sendMessage(this.chatId, `Я тебя не понимаю... Попробуй еще раз!`);
    // }
}

export default TgBotUtilsImpl;
