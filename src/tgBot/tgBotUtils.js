import {BUTTON_COMMANDS} from "./constants/tgBotConstants.js";

export const getOptionsByMass = (mass) => ({
    reply_markup: JSON.stringify({
        inline_keyboard: [
            ...mass.map((item) => [
                {
                    text: item.value,
                    callback_data: JSON.stringify(item.key),
                },
            ]),
            [
                {
                    text: 'Отменить операцию',
                    callback_data: JSON.stringify({command: BUTTON_COMMANDS.DELETE_CATEGORY, id: -1, name: 'Отмена'}),
                },
            ],
        ],
    }),
});

export const getKeyboardWithPhoneNumberRequest = () => ({
    reply_markup: {
        keyboard: [[{
            text: '📲 Оставить номер телефона',
            request_contact: true,
        }]],
        one_time_keyboard: true,
    },
})

const _getProductList = (cart) => `${cart?.map(item => `${item?.title}\nЦена: ${item?.sellingPrice}\nКоличество: ${item?.counter}\n_________________________\n\n`)}`

export const getOrderMessageForUser = (cart = [], amountToBePaid, discount) =>
    'Ваш заказ передан на обработку специалистам!\n' +
    'С вами свяжутся в ближайшее время!\n\n' +
    'Вы заказали:\n\n' +
    _getProductList(cart) +
    'Цена: ' + amountToBePaid + '\n' +
    'Скидка: ' + discount + '\n' +
    'К оплате: ' + (amountToBePaid - discount).toFixed(2)

export const getOrderMessageForAdmin = (cart, client, amountToBePaid, discount) =>
    'Новый заказ!!!\n' +
    'Информация о покупателе!\n' +
    `Телефон: ${client?.phoneNumber}\n` +
    `${client?.username ? 'Telegram: @' + client?.username + '\n' : ''}` +
    `Имя: ${client?.firstname || ''} ${client?.lastname || ''}\n\n` +
    _getProductList(cart) +
    'Цена: ' + amountToBePaid + '\n' +
    'Скидка: ' + discount + '\n' +
    'К оплате: ' + (amountToBePaid - discount)?.toFixed(2)


