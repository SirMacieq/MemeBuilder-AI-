import ResponseError from "../../frameworks/common/ResponseError";
import ResponseRequest from "../../frameworks/common/ResponseRequest";
import { Request, Response, NextFunction } from "express";
import verifySignedMessage from "../../services/utils/verifySignedMessage";

export default function (dependencies: any) {
  const { useCases } = dependencies;
  const { signinUserUseCase } = useCases;

  const signinUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { wallet, signedMessage, message } = req.body;
      const verifSignature = verifySignedMessage(message, signedMessage, wallet)
      if(verifSignature){
        const signinUser = await signinUserUseCase(dependencies).execute;
        const response = await signinUser({
          wallet,
        });
        res.json(response);
      } else {
        res.json(
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
      
    } catch (err) {
      res.json(
        new ResponseRequest({
          status: 500,
          content: null,
          error: new ResponseError({
            error: err,
            msg: "Request error",
          }),
        })
      );
    }
  };

  return { signinUserController };
}
