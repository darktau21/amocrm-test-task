import TokenModel, { getTokens } from '@models/TokenModel';
import apiClient from '@services/apiClient';
import * as process from 'process';

const { INTEGRATION_ID, REDIRECT_URI, SECRET_KEY } = process.env;

type AuthCodeResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: 'Bearer';
};

export async function registerCode(code: string) {
  const { data: tokens } = await apiClient.post<AuthCodeResponse>(
    '/oauth2/access_token',
    {
      client_id: INTEGRATION_ID,
      client_secret: SECRET_KEY,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    },
  );

  await TokenModel.truncate();
  await TokenModel.create({
    access: tokens.access_token,
    expiresIn: tokens.expires_in,
    refresh: tokens.refresh_token,
  });
}

async function isTokenValid() {
  const tokens = await getTokens();

  if (!tokens.expiresIn) {
    return false;
  }

  return (
    Date.now() + tokens.expiresIn * 1000 - Date.parse(tokens.createdAt) > 0
  );
}

export async function updateTokens() {
  if (await isTokenValid()) return await getTokens();
  console.log('Ping');

  const { refresh: refreshToken } = await getTokens();

  const { data: tokens } = await apiClient.post<AuthCodeResponse>(
    '/oauth2/access_token',
    {
      client_id: INTEGRATION_ID,
      client_secret: SECRET_KEY,
      grant_type: 'refresh_token',
      redirect_uri: REDIRECT_URI,
      refresh_token: refreshToken,
    },
  );

  await TokenModel.truncate();
  await TokenModel.create({
    access: tokens.access_token,
    expiresIn: tokens.expires_in,
    refresh: tokens.refresh_token,
  });

  return await getTokens();
}
