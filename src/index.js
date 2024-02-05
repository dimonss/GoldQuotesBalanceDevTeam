import express from 'express';
import QuoteSQL from './db/quoteSQL.js';
import {commonDto} from './DTO/common.js';
import {STATUS} from './constants.js';
import tgBot from './tgBot/tgBot.js';
import {checkAuth} from './utils/commonUtils.js';
import dotenv from 'dotenv';
import chatIdSQL from "./db/chatIdSQL.js";

dotenv.config();

const HOSTNAME = process.env.HOSTNAME;
export const TG_TOKEN = process.env.TG_TOKEN;
export const AUTH = process.env.AUTH;
export const BOT_NAME = process.env.BOT_NAME;
const PORT = process.env.PORT || 4000;

const app = express();
tgBot(TG_TOKEN);
const startApp = async () => {
    try {
        app.listen(PORT, HOSTNAME, () => {
            console.log(`Server started on ${PORT} port`);
        });
    } catch (e) {
        console.log('e');
        console.log(e);
    }
    app.use(express.json());
    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        res.append('Access-Control-Allow-Headers', 'Content-Type,Auth,auth');
        next();
    });

    //QUOTE/////////////////////////////////////////////;

    app.get('/quote', (req, res, next) => {
        if (checkAuth(req, res)) {
            QuoteSQL.all(
                (error, product) => {
                    if (error) return next(error);
                    res.json(commonDto(STATUS.OK, 'success', product));
                },
                req?.query?.search,
                req?.query?.categoryId,
            );
        }
    });
    app.get('/chats', (req, res, next) => {
        if (checkAuth(req, res)) {
            chatIdSQL.all(
                (error, product) => {
                    if (error) return next(error);
                    res.json(commonDto(STATUS.OK, 'success', product));
                },
            );
        }
    });

    app.get('/random_quote', (req, res, next) => {
        QuoteSQL.getRandom(1, (error, data) => {
            if (error) return next(error);
            res.json(
                commonDto(
                    data?.length ? STATUS.OK : STATUS.NOT_FOUND,
                    'success',
                    data[0]?.text,
                ),
            );
        });
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
};

startApp();
