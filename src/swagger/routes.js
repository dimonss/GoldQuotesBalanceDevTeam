/**
 * @swagger
 * /quote:
 *   get:
 *     summary: Получить все цитаты
 *     description: Возвращает список всех цитат с возможностью фильтрации
 *     tags:
 *       - Quotes
 *     security:
 *       - AuthHeader: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по тексту цитаты
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Фильтр по ID категории
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/CommonResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Quote'
 *       401:
 *         description: Не авторизован
 */

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Получить все чаты
 *     description: Возвращает список всех зарегистрированных чатов
 *     tags:
 *       - Chats
 *     security:
 *       - AuthHeader: []
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/CommonResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Chat'
 *       401:
 *         description: Не авторизован
 */

/**
 * @swagger
 * /random_quote:
 *   get:
 *     summary: Получить случайную цитату
 *     description: Возвращает одну случайную цитату (без авторизации)
 *     tags:
 *       - Quotes
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/CommonResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: string
 *                       description: Текст случайной цитаты
 *       404:
 *         description: Цитаты не найдены
 */
