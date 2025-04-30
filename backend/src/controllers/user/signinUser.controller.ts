import ResponseError from "../../frameworks/common/ResponseError";
import ResponseRequest from "../../frameworks/common/ResponseRequest";
import { Request, Response, NextFunction } from "express";

export default function (dependencies: any) {
  const { useCases } = dependencies;
  const { signinUserUseCase } = useCases;

  const signinUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { wallet } = req.body;

      const signinUser = await signinUserUseCase(dependencies).execute;
      const response = await signinUser({
        wallet
      });
      res.json(response);
    } catch (err) {
      res.json(
        new ResponseRequest({
          status: 500,
          content: null,
          error: new ResponseError({
            error: err,
            msg: "Request error",
          }),
        }),
      );
    }
  };

  return { signinUserController };
}
