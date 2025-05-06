import ResponseError from "../../frameworks/common/ResponseError";
import ResponseRequest from "../../frameworks/common/ResponseRequest";
import { Request, Response, NextFunction } from "express";
import verifySignedMessage from "../../services/utils/verifySignedMessage";
import { PublicKey } from "@solana/web3.js";

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
      if (!wallet || !signedMessage || !message) {
        res.json(
          new ResponseRequest({
          status: 400,
          error: new ResponseError({
            error: "Bad request",
            msg: "Missing required fields (wallet, signedMessage, message)",
          }),
          content: null,
        }));
      }

      try {
        new PublicKey(wallet);
      } catch (e) {
        res.json(
          new ResponseRequest({
          status: 400,
          error: new ResponseError({
            error: "Invalid public key",
            msg: "Provided wallet is not a valid Solana public key",
          }),
          content: null,
        }));
      }

      let sigBytes: Uint8Array;
      try {
        const buf = Buffer.from(signedMessage, "base64");
        if (buf.length !== 64) {
          throw new Error("Bad signature length");
        }
        sigBytes = new Uint8Array(buf);
      } catch (e) {
        res.json(
          new ResponseRequest({
          status: 400,
          error: new ResponseError({
            error: "Invalid signature fÒormat",
            msg: "signedMessage must be a valid base64 string of a 64-byte signature",
          }),
          content: null,
        }));
      }
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
