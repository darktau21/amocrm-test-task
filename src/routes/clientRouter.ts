import * as clientController from '@controllers/clientController';
import { Router } from 'express';

const clientRouter = Router();

clientRouter.get('/search', clientController.searchClient);

export default clientRouter;
