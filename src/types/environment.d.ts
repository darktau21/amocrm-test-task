export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_NAME: string;
      DB_PASSWORD: string;
      DB_PORT: number;
      DB_USER: string;
      INTEGRATION_ID: string;
      PORT: number;
      REDIRECT_URI: string;
      SECRET_KEY: string;
      SUBDOMAIN: string;
    }
  }
}
