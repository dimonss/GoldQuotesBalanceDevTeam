import sqlite3 from 'sqlite3';

const dbName = 'db.sqlite';

const privateQuotes = ['Комплект винограда ©Куба', 'Пока есть очко есть надежда ©Назим', 'Если сроки просрачишь ©Эльвира', 'Чтоб тебя не использовали нужно быть бесполезным ©Сомат', 'Я был настолько рядом, что очччень рядом был © Куба', 'Можно подумать Куба прям iOS Разработчик ©Аида', 'Эляман, с тобой хоть на край света ©Сомат', 'Кстати, кто я? ©Арс', 'Это же суп, он же легкий ©Дмитрий А', 'Надеюсь вы знаете, что это не бесплатно © Эльбрус', 'Желаю чтобы ты докончил ремонт дома ©Самат', 'Жена мужа ©Диана', 'Вчера ничего не делал, сегодня сделаю ©Тоби', '1820 год - Это начало 17-го века ©Куба', 'Это Магия какая-то ©Нурзамат', 'Дима Дзержинский ©Куба', 'Самат! Сидеть! ©Катя', 'Дядя Тоби ©Пуртов Алексей', 'Проблема в самом Назиме ©Дмитрий Чалыш', 'Вот он шпрот ©Куба', 'Ты каким человеком стал? @Kuba', 'Я слышу голос Кубы в твоём голосе ©Сомат', '-Куда ходил? \n' + '-На балкон.\n' + '-Не на собеседование?\n' + '©Нурзамат']

const publicQuotes = ['Когда весь мир против тебя, помни, что самолет взлетает против ветра ©Арс', 'Многоуважаемые тестировщики ©Эльбрус', 'Самое главное, это твоя команда ©Адилет', 'Либо вам нужна кафка, либо не нужна кафка ©Никита Ногай', 'Я знаю где взять dev сервер - это localhost ©Нурзамат', 'Чекал и окал ©Самат', 'Не процессит, но хорошие надежды дает ©Нурзамат', 'Когда все начиналось я только устроился сюда ©Эльбрус', 'Сделал сапорт ©Самат', 'Нельзя себя так часто баловать ©Сомат', 'Все готово ©Пуртов', 'Web не соответствует Androidu на IOS-e ©Назим', 'Назим ты тестер ты не разраб ©Сомат']

const commonQuotes = [...privateQuotes,...publicQuotes]
const chatId = ['1449594308', '326001965'];


const db = new sqlite3.Database(dbName);

chatId.forEach((item) => {
    db.run(`INSERT INTO chatId (chatId) VALUES ("${item}")`, (result) => {
        if (result) {
            console.log('\x1b[31m', "ERROR " + result + " " + item);
        } else {
            console.log('\x1b[32m', "SUCCESS ADD " + item);
        }
    })
})
privateQuotes.forEach((item) => {
    db.run(`INSERT INTO quote (chatIdKey, text) VALUES (1, "${item}")`, (result) => {
        if (result) {
            console.log('\x1b[31m', "ERROR " + result + " " + item);
        } else {
            console.log('\x1b[32m', "SUCCESS ADD " + item);
        }
    })
})
commonQuotes.forEach((item) => {
    db.run(`INSERT INTO quote (chatIdKey, text) VALUES (2, "${item}")`, (result) => {
        if (result) {
            console.log('\x1b[31m', "ERROR " + result + " " + item);
        } else {
            console.log('\x1b[32m', "SUCCESS ADD " + item);
        }
    })
})

db.close();
console.log('\x1b[32m', 'FULL COMPLETED');
console.log('\x1b[0m', '');
