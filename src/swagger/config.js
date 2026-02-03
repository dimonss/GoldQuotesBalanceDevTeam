import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gold Quotes API',
            version: '1.0.0',
            description: 'API для хранения золотых цитат Dev Team',
            contact: {
                name: 'DiCh',
            },
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Development server',
            },
            {
                url: 'https://chalysh.pro/quote_api',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                AuthHeader: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'authorization',
                    description: 'Authorization header',
                },
            },
            schemas: {
                CommonResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['OK', 'ERROR', 'NOT_FOUND'],
                            description: 'Status of the response',
                        },
                        message: {
                            type: 'string',
                            description: 'Response message',
                        },
                        data: {
                            oneOf: [
                                { type: 'array' },
                                { type: 'object' },
                                { type: 'string' },
                                { type: 'null' },
                            ],
                            description: 'Response data',
                        },
                    },
                },
                Quote: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Quote ID',
                        },
                        text: {
                            type: 'string',
                            description: 'Quote text',
                        },
                        categoryId: {
                            type: 'integer',
                            description: 'Category ID',
                        },
                    },
                },
                Chat: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Chat ID',
                        },
                        chatId: {
                            type: 'string',
                            description: 'Telegram Chat ID',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/swagger/routes.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
