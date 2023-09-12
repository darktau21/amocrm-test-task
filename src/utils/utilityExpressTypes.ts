import { Request } from 'express';

type TypedRequestQuery<T extends string> = Request<
  object,
  object,
  object,
  { [K in T]?: string }
>;

export { TypedRequestQuery };
