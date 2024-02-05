import strings from "../../../constants/strings.js";

class tgBotUtilCallback {
    constructor(bot, msg, data) {
        this.bot = bot;
        this.chatId = msg?.message?.chat?.id;
        this.data = data
    }

    async error() {
        await this.bot.sendMessage(this.chatId, strings.error_msg);
    }
}

export default tgBotUtilCallback;
