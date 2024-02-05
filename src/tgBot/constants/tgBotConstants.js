export const COMMAND = {
    START: '/start',
    INFO: '/info',
    SEARCH: '/search',
    GET_RAND_QUOTE: '/get_rand_quote',
    CHAT_ID: '/chat_id',
    DELETE:'/delete',
};

export const tgBotDisplayCommands = [
    {command: COMMAND.START, description: 'Запустить бота'},
    {command: COMMAND.INFO, description: 'Информация о цитатах'},
    {command: COMMAND.GET_RAND_QUOTE, description: 'Получить рандомную цитату'},
    {command: COMMAND.SEARCH, description: 'Поиск цитаты'},
    {command: COMMAND.DELETE, description: 'Удалить цитату'},
];

export const BUTTON_COMMANDS = {
    DELETE_QUOTE: 'DC',
};
