import * as authController from '@controllers/authController';
import { Router } from 'express';

const authRouter = Router();

authRouter.get('/register', authController.requestAccessToken);

export default authRouter;
