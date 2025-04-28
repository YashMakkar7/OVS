import { Router, Request, Response } from "express";
import { adminMiddleware } from "../Middleware/middleware";
import { User } from "../db";
const infoRouter = Router();

infoRouter.get("/admin", adminMiddleware, async (req: Request, res: Response) => {
    try {
        const adminId = req.body.userId;
        const admin = await User.findById(adminId);
        
        if (!admin) {
            res.status(404).json({ success: false, error: "Admin not found" });
            return;
        }
        
        res.status(200).json({ 
                username: admin.username,
                email: admin.email,
                adharId: admin.adharId
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to admin details" });
    }
});

export default infoRouter;