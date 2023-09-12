import {
  createContact,
  createLead,
  getContact,
  updateContact,
} from '@services/crmService';
import { TypedRequestQuery } from '@utils/utilityExpressTypes';
import { NextFunction, Response } from 'express';
import { logger } from 'sequelize/types/utils/logger';
import apiClient from '@services/apiClient';

type QueryParams = 'email' | 'name' | 'phone';

export async function searchClient(
  req: TypedRequestQuery<QueryParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    let client = await getContact(req.query);
    // res.json(client);
    if (client) {
      await updateContact({ ...req.query, ...client });
    }

    if (!client) {
      await createContact(req.query);
    }

    client = await getContact(req.query);

    if (client === null) return;

    await createLead(client);

    return res.json({ data: { client }, status: 'success' });
  } catch (e) {
    // console.log(e);
    return next();
  }
}
