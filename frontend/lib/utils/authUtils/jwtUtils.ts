import { jwtVerify } from "jose";
import { CustomJWTClaims } from "@/types/auth";
import { SignJWT } from "jose";

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET as string);

/**
 * Encodes the claims and gives back the token
 */
export const encode = async (claims: CustomJWTClaims): Promise<string> => {
  return await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(encodedKey);
};

/**
 * Decodes the jwt token and gives back the claims.
 * Throws on error
 */
export const decode = async (token: string): Promise<CustomJWTClaims> => {
  const claims = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
  return claims.payload as CustomJWTClaims;
};
