import { Router } from "express";
import usersRouter from './users.js';
import analyseRouter from './analyse.js';
import chatbotRouter from './chatbot.js';
import historyRouter from './history.js';

const router = Router();
router.use(usersRouter);
router.use(analyseRouter);
router.use('/api/chatbot', chatbotRouter);
router.use('/api/history', historyRouter);

export default router;