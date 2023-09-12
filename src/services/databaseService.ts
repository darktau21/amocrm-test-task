import Token from '@models/TokenModel';
import { Sequelize } from 'sequelize-typescript';

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
});

sequelize.addModels([Token]);

export default sequelize;
