// src/global.d.ts
import User from "./models/User"; // optional: if you have a User model

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}