import { JWTPayload } from "jose";
import { UserRole } from "./users";

export interface CustomJWTClaims extends JWTPayload {
  userId: string;
  userRole: UserRole;
}
