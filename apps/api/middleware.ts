import type { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"]?.split(' ')[1];
    req.userId = "1";
    next();
}