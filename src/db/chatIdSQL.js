import sqlite3 from 'sqlite3';

sqlite3.verbose();
const dbName = 'db.sqlite';
const chats = new sqlite3.Database(dbName);

class ChatIdSQL {
    static all(cb) {
        chats.all('SELECT * FROM chatId', cb);
    }
    static getChatIdKeyByChatId(chatId, cb) {
        chats.get(`SELECT id FROM chatId WHERE chatId = ?`, chatId, cb);
    }
    static find(id, cb) {
        chats.get('SELECT * FROM chatId WHERE id = ?', id, cb);
    }

    static findByChatId(id, cb) {
        chats.get('SELECT * FROM chatId WHERE chatId = ?', id, cb);
    }

    static _findByToken(token, cb) {
        chats.get('SELECT * FROM chatId WHERE token = ?', token, cb);
    }

    static update(data, cb) {
        const sql = 'UPDATE client SET firstname = ?, lastname = ?, login = ?, password = ?, photo=? WHERE id = ?';
        chats.run(sql, data.firstname, data.lastname, data.login, data.password, data.photo, cb);
    }

    static delete(id, cb) {
        if (!id) return cb(new Error('Please provide an id'));
        chats.run(`DELETE FROM chatId WHERE id = ?`, id, cb);
    }

    static chatExist(chatId, cb) {
        chats.get(`SELECT id FROM chatId WHERE chatId = ${chatId}`, cb);
    }
    static add(chatId, cb) {
        chats.run(`INSERT INTO chatId (chatId) VALUES ("${chatId}")`, cb);
    }
}

export default ChatIdSQL;
