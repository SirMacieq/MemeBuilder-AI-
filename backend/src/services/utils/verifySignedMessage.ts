import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

/**
 * Checks if message is signed with corresponding public key
 *
 * @param message message to be verified
 * @param signature signed message in base64
 * @param pk public key in string format
 */
const verifySignedMessage = (
  message: string,
  signature: string,
  pk: string,
): boolean => {
  const pkBytes = new PublicKey(pk);
  const messBytes = new TextEncoder().encode(message);
  const sigBytes = new Uint8Array(Buffer.from(signature, "base64"));
  return nacl.sign.detached.verify(messBytes, sigBytes, pkBytes.toBytes());
};
export default verifySignedMessage;
