import * as dotenv from 'dotenv';

dotenv.config();

import errorMiddleware from '@middlewares/errorMiddleware';
import appRouter from '@routes';
import sequelize from '@services/databaseService';
import Express from 'express';

const { PORT } = process.env;
const app: Express.Application = Express();

app.use(appRouter);
app.use(errorMiddleware);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
  } catch (e) {
    console.error(e);
  }
}

start();
