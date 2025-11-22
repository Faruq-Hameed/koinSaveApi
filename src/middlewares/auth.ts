import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: "No token" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
