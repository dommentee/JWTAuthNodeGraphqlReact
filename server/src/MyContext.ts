import { Request, Response } from 'express';

//for typscript proposes
export interface MyContext {
  req: Request;
  res: Response;
}