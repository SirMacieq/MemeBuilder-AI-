import jwt from "jsonwebtoken"

export async function createToken(
    id: string,
  ): Promise<string> {
    const payload = {
      id,
    }
  
    let SECRET_TOKEN_USER = "";
  
    if (process.env.SECRET_TOKEN) {
      SECRET_TOKEN_USER = process.env.SECRET_TOKEN;
    }
    return await jwt.sign(payload, SECRET_TOKEN_USER)
  }

  export function verifyAccesToken(accessToken: string) {
    try {
      if(process.env.SECRET_TOKEN) {
        const decoded = jwt.verify(accessToken, process.env.SECRET_TOKEN);
        return decoded;
      } else {
        return null
      }
    } catch (err) {
      return null;
    }
  }
  