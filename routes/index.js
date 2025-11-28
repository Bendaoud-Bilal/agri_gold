import { Router } from "express";
import usersRouter from './users.js';
import analyseRouter from './analyse.js';
import chatbotRouter from './chatbot.js';

const router = Router();
router.use(usersRouter);
router.use(analyseRouter);
router.use('/api/chatbot', chatbotRouter);

export default router;