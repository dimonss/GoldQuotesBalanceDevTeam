import QuoteSQL from '../../../db/quoteSQL.js';
import {BUTTON_COMMANDS} from '../../constants/tgBotConstants.js';
import ChatIdSQL from "../../../db/chatIdSQL.js";
import quoteSQL from "../../../db/quoteSQL.js";
import chatIdSQL from "../../../db/chatIdSQL.js";
import strings from "../../../constants/strings.js";
import {BOT_NAME} from "../../../index.js";

class TgBotQuoteImpl {
    constructor(bot, msg) {
        this.bot = bot;
        this.chatId = msg?.chat?.id;
        this.text = msg.text;
    }

    async add() {
        let tetForAdd = this.text.replace('#Цитата', '')
        tetForAdd = tetForAdd.replace('#цитата', '')
        tetForAdd = tetForAdd.replace(BOT_NAME, '')
        const QuoteAndAuthor = tetForAdd.split("©")
        try {
            if (QuoteAndAuthor[0].length < 9) {
                await this.bot.sendMessage(
                    this.chatId,
                    `Цитата слишком коротка.😞\nНе смог сохранить`,
                );
                return
            }
            if (QuoteAndAuthor[1].length < 2) {
                await this.bot.sendMessage(
                    this.chatId,
                    `Имя автора цитаты слишком коротко.😞\nНе смог сохранить`,
                );
                return
            }
            const addQuote = () => {
                ChatIdSQL.chatExist(this.chatId, async (error, data) => {
                    if (data?.id) {
                        quoteSQL.create({text: tetForAdd, chatIdKey: data?.id}, async (error) => {
                            if (!error) {
                                await this.bot.sendMessage(
                                    this.chatId,
                                    `Цитата добавлена!`,
                                );
                            } else {
                                await this.bot.sendMessage(
                                    this.chatId,
                                    strings.ups,
                                );
                            }
                        })
                    } else {
                        ChatIdSQL.add(this.chatId, async (error) => {
                            if (error) {
                                await this.bot.sendMessage(
                                    this.chatId,
                                    strings.ups,
                                );
                            } else {
                                addQuote();
                            }
                        })
                    }
                })
            }
            addQuote();

        } catch (e) {
            await this.bot.sendMessage(
                this.chatId,
                strings.ups,
            );
        }
    }


    async find() {
        const searchText = this.text[7] === ' ' ? this.text.slice(8) : this.text.slice(7);
        searchText.replace(BOT_NAME, '');
        if (!searchText?.length) {
            await this.bot.sendMessage(
                this.chatId,
                `Не увидел текст для поиска, напишите текст для поиска сразу после команды.`,
            );
            return;
        }
        chatIdSQL.getChatIdKeyByChatId(this?.chatId, async (error, chat) => {
            if (error) {
                await this.bot.sendMessage(this.chatId, 'error');
                return;
            }
            if (!chat) {
                this.bot.sendMessage(
                    this.chatId,
                    "У вас еще нет сохраненных цитат",
                );
                return;
            }
            QuoteSQL.findWithLimit(searchText, chat?.id, async (error, quotas) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, strings.ups);
                    return;
                }
                if (!quotas.length) {
                    await this.bot.sendMessage(this.chatId, 'Ничего не найдено ☹️');

                }
                quotas.forEach((item) => {
                    this.bot.sendMessage(
                        this.chatId,
                        `${item.text}\n`,
                    );
                });
            });
        })
    }

    async deleteQuote() {
        const searchText = this.text[7] === ' ' ? this.text.slice(8) : this.text.slice(7);
        if (!searchText?.length) {
            await this.bot.sendMessage(
                this.chatId,
                `Не увидел текст для поиска, напишите текст для поиска сразу после команды.`,
            );
            return;
        }
        chatIdSQL.getChatIdKeyByChatId(this?.chatId, async (error, chat) => {
            if (error) {
                await this.bot.sendMessage(this.chatId, 'error');
                return;
            }
            if (!chat) {
                this.bot.sendMessage(
                    this.chatId,
                    "У вас еще нет сохраненных цитат",
                );
                return;
            }
            QuoteSQL.findWithLimit(searchText, chat?.id, async (error, quotas) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, strings.ups);
                    return;
                }
                if (!quotas.length) {
                    await this.bot.sendMessage(this.chatId, 'Ничего не найдено ☹️');

                }
                this.bot.sendMessage(
                    this.chatId,
                    "Какую цитату удалить?",
                    {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                ...quotas.map((item) => [{
                                    text: `${item.text}\n`,
                                    callback_data: JSON.stringify({
                                        id: item?.id,
                                        command: BUTTON_COMMANDS.DELETE_QUOTE,
                                    }),
                                }]),
                                [
                                    {
                                        text: 'Отменить операцию',
                                        callback_data: JSON.stringify({
                                            command: BUTTON_COMMANDS.DELETE_QUOTE,
                                            id: -1,
                                            name: 'Отмена'
                                        }),
                                    },
                                ],
                            ],
                        }),
                    },
                );
            });

        })
    }


    async getRandom() {
        ChatIdSQL.getChatIdKeyByChatId(this?.chatId, async (error, chat) => {
            if (error) {
                await this.bot.sendMessage(this.chatId, 'error');
                return;
            }
            if (!chat) {
                this.bot.sendMessage(
                    this.chatId,
                    "У вас еще нет сохраненных цитат",
                );
                return;
            }
            QuoteSQL.getRandom(chat.id, async (error, client) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, 'error');
                    return;
                }
                client.map((item) => {
                    this.bot.sendMessage(
                        this.chatId,
                        item.text + " " + item?.chatIdKey,
                    );
                });
            });
        })
    }
}

export default TgBotQuoteImpl;
