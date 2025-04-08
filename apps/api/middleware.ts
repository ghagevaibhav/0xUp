import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "./config";

export function authMiddleware() {
    return function(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization']?.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        try {
            const decoded = jwt.verify(token, JWT_PUBLIC_KEY);
            if (!decoded || !decoded.sub) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            req.userId = decoded.sub as string;
            
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
    };
}