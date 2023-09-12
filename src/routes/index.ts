import authRouter from '@routes/authRouter';
import clientRouter from '@routes/clientRouter';
import { Router } from 'express';

const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/client', clientRouter);

appRouter.use('*', async (req, res) => {
  return res.status(404).json({
    code: 404,
    message: 'Resource not found',
    status: 'error',
  });
});

export default appRouter;
