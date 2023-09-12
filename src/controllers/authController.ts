import { registerCode } from '@services/tokenService';
import { TypedRequestQuery } from '@utils/utilityExpressTypes';
import { NextFunction, Response } from 'express';

type QueryParams = 'code' | 'referer';

export async function requestAccessToken(
  req: TypedRequestQuery<QueryParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { code } = req.query;
    if (!code) {
      return next();
    }

    await registerCode(code);

    return res.send();
  } catch (_) {
    return next();
  }
}
