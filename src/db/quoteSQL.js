import sqlite3 from 'sqlite3';
import {getAndSqlReq} from '../utils/commonUtils.js';

sqlite3.verbose();
const dbName = 'db.sqlite';
const quoteSQL = new sqlite3.Database(dbName);

const userAvailableKeys = 'text, chatIdKey';

class QuoteSQL {
    static create(data, cb) {
        const sql =
            'INSERT INTO quote(text, chatIdKey) VALUES (?,?)';
        quoteSQL.run(
            sql,
            data.text,
            data.chatIdKey,
            cb,
        );
    }

    static allForAdmin(cb) {
        quoteSQL.all(`SELECT * FROM quote ORDER BY id DESC`, cb);
    }

    static all(cb, searchText = '', categoryId) {
        quoteSQL.all(
            `SELECT ${userAvailableKeys} FROM quote WHERE ${getAndSqlReq(searchText)}${
                categoryId ? ' AND categoryId =' + categoryId : ''
            } ORDER BY id DESC`,
            cb,
        );
    }

    static findById(id, cb) {
        quoteSQL.get(`SELECT ${userAvailableKeys} FROM quote WHERE id = ? ORDER BY id DESC`, id, cb);
    }

    static findByListId(list, cb) {
        quoteSQL.all(`SELECT ${userAvailableKeys} FROM quote WHERE id IN (${list}) ORDER BY id DESC`, cb);
    }

    static findByCategoryId(categoryId, cb) {
        quoteSQL.all(
            `SELECT ${userAvailableKeys} FROM quote WHERE categoryId = ? ORDER BY id DESC`,
            categoryId,
            cb,
        );
    }

    static update(data, cb) {
        let sql =
            'UPDATE quote SET ' +
            `${data?.chatIdKey ? 'chatIdKey = ' + data?.chatIdKey + ', ' : ''}` +
            `${data?.text ? 'text = "' + data?.text + '", ' : ''}` +
            `WHERE id = ${data.id}`;
        sql = sql.replace(', WHERE id = ', ' WHERE id = ');
        quoteSQL.run(sql, cb);
    }

    static delete(id, cb) {
        if (!id) return cb(new Error('Please provide an id'));
        quoteSQL.run(`DELETE FROM quote WHERE id = ?`, id, cb);
    }

    static find(searchText, cb) {
        quoteSQL.all(
            `SELECT ${userAvailableKeys} FROM quote WHERE ${getAndSqlReq(searchText)} ORDER BY id DESC`,
            cb,
        );
    }

    static findWithLimit(searchText, chatIdKet, cb) {
        quoteSQL.all(
            `SELECT id, ${userAvailableKeys} FROM quote WHERE ${getAndSqlReq(searchText)} AND chatIdKey like ${chatIdKet} LIMIT 5`,
            cb,
        );
    }

    static getRandom(chatIdKey, cb) {
        quoteSQL.all(`SELECT ${userAvailableKeys} FROM quote WHERE chatIdKey like ${chatIdKey} ORDER BY RANDOM() LIMIT 1;`, cb);
    }

    static getCountByChatIdKey(chatIdKey, cb) {
        quoteSQL.get(`SELECT COUNT(chatIdKey) FROM quote WHERE chatIdKey like ${chatIdKey}`, cb);
    }
}

export default QuoteSQL;
