
import { Request, Response, NextFunction } from 'express';
import ResponseError from '../../common/ResponseError';
import ResponseRequest from '../../common/ResponseRequest';
import { verifyAccesToken } from '../../../services/utils/token';


export const withAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.json(
      new ResponseRequest({
        status: 401,
        error: new ResponseError({
          error: 'Unauthorized',
          msg: 'Acces forbidden',
        }),
        content: null,
      }),
    );
  }
  const decoded = verifyAccesToken(token.toString());
  if (decoded) {
    next();
  } else {
    return res.json(
        new ResponseRequest({
            status: 401,
            error: new ResponseError({
            error: 'Unauthorized',
            msg: 'Acces forbidden',
            }),
            content: null,
        }),
    );
  }
};