import axios from 'axios';
import * as process from 'process';

const { SUBDOMAIN } = process.env;

const apiClient = axios.create({
  baseURL: `https://${SUBDOMAIN}.amocrm.ru`,
  timeout: 3000,
});

export default apiClient;
