import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

// Define the middleware with RequestHandler type
export const authMiddleware: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            res.status(401).json({ msg: "No token provided" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }
};
