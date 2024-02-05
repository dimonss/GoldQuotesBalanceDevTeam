// import CategorySQL from "../../../db/CategorySQL.js";
// import strings from "../../../constants/strings.js";

import QuoteSQL from "../../../db/quoteSQL.js";

class TgBotQuotaCallback {
    constructor(bot, msg, data) {
        this.bot = bot;
        this.chatId = msg?.message?.chat?.id;
        this.data = data;
        this.msg = msg;
    }

    async delete() {
        await this.bot.deleteMessage(this.chatId, this.msg.message.message_id);
        if (this.data.id === -1) {
            return;
        }
        try {
            QuoteSQL.delete(this.data?.id, async (error) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, strings.error_msg);
                } else {
                    await this.bot.sendMessage(this.chatId, `Цитата успешно удалена`);
                }
            });
        } catch (e) {
            await this.bot.sendMessage(this.chatId, strings.error_msg);
        }
    }
}

export default TgBotQuotaCallback;
