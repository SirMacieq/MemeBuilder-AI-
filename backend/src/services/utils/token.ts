import jwt from "jsonwebtoken";
import { Types } from "mongoose";s

export async function createToken(
    id: string,
    duration?: string,
  ): Promise<string> {
    const payload = {
      id,
    };
  
    let durationTime = "30d";
  
    if (duration) {
      durationTime = duration;
    }
  
    let SECRET_TOKEN = "";
  
    if (process.env.SECRET_TOKEN) {
      SECRET_TOKEN = process.env.SECRET_TOKEN;
    }
  
    return await jwt.sign(payload, SECRET_TOKEN, {
      expiresIn: durationTime, // expires in 30 days
    });
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
  