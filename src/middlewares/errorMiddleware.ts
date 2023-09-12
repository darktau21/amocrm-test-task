import { Request, Response } from 'express';

export default async function errorMiddleware(req: Request, res: Response) {
  return res
    .status(500)
    .json({ code: 500, message: 'Something went wrong', status: 'error' });
}
