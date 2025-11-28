import { Router } from "express";
import usersRouter from './users.js';
import analyseRouter from './analyse.js';
import predictionRouter from './prediction.js';
const router = Router();
router.use(usersRouter);
router.use(analyseRouter);
router.use(predictionRouter);
export default router;