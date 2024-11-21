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
        this.message_thread_id = msg?.message_thread_id ? {message_thread_id: msg?.message_thread_id} : {};
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
                      this.message_thread_id,
                );
                return
            }
            if (QuoteAndAuthor[1].length < 2) {
                await this.bot.sendMessage(
                    this.chatId,
                    `Имя автора цитаты слишком коротко.😞\nНе смог сохранить`,
                      this.message_thread_id,
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
                                      this.message_thread_id,
                                );
                            } else {
                                await this.bot.sendMessage(
                                    this.chatId,
                                    strings.ups,
                                      this.message_thread_id,
                                );
                            }
                        })
                    } else {
                        ChatIdSQL.add(this.chatId, async (error) => {
                            if (error) {
                                await this.bot.sendMessage(
                                    this.chatId,
                                    strings.ups,
                                      this.message_thread_id,
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
                  this.message_thread_id,
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
                  this.message_thread_id,
            );
            return;
        }
        chatIdSQL.getChatIdKeyByChatId(this?.chatId, async (error, chat) => {
            if (error) {
                await this.bot.sendMessage(this.chatId, 'error', this.message_thread_id,);
                return;
            }
            if (!chat) {
                this.bot.sendMessage(
                    this.chatId,
                    "У вас еще нет сохраненных цитат",
                    this.message_thread_id,
                );
                return;
            }
            QuoteSQL.findWithLimit(searchText, chat?.id, async (error, quotas) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, strings.ups, this.message_thread_id,);
                    return;
                }
                if (!quotas.length) {
                    await this.bot.sendMessage(this.chatId, 'Ничего не найдено ☹️', this.message_thread_id,);

                }
                quotas.forEach((item) => {
                    this.bot.sendMessage(
                        this.chatId,
                        `${item.text}\n`,
                        this.message_thread_id,
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
                this.message_thread_id,
            );
            return;
        }
        chatIdSQL.getChatIdKeyByChatId(this?.chatId, async (error, chat) => {
            if (error) {
                await this.bot.sendMessage(this.chatId, 'error', this.message_thread_id,);
                return;
            }
            if (!chat) {
                this.bot.sendMessage(
                    this.chatId,
                    "У вас еще нет сохраненных цитат",
                    this.message_thread_id,
                );
                return;
            }
            QuoteSQL.findWithLimit(searchText, chat?.id, async (error, quotas) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, strings.ups, this.message_thread_id,);
                    return;
                }
                if (!quotas.length) {
                    await this.bot.sendMessage(this.chatId, 'Ничего не найдено ☹️', this.message_thread_id,);

                }
                this.bot.sendMessage(
                    this.chatId,
                    "Какую цитату удалить?",
                    {...this.message_thread_id,
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
                await this.bot.sendMessage(this.chatId, 'error', this.message_thread_id,);
                return;
            }
            if (!chat) {
                this.bot.sendMessage(
                    this.chatId,
                    "У вас еще нет сохраненных цитат",
                    this.message_thread_id,
                );
                return;
            }
            QuoteSQL.getRandom(chat.id, async (error, client) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, 'error', this.message_thread_id,);
                    return;
                }
                client.map((item) => {
                    this.bot.sendMessage(
                        this.chatId,
                        item.text,
                        this.message_thread_id,
                    );
                });
            });
        })
    }
}

export default TgBotQuoteImpl;
