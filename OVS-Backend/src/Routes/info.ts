import { Router, Request, Response } from "express";
import { adminMiddleware, authMiddleware } from "../Middleware/middleware";
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

infoRouter.get("/user", authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        
        // Include both possible spellings to ensure it works
        res.status(200).json({ 
            username: user.username,
            email: user.email,
            adharId: user.adharId,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to get user details" });
    }
});



infoRouter.get("/users",adminMiddleware,async(req:Request,res:Response)=>{
    try{
        const users = await User.find();
        res.status(200).json({success:true,users});
    }catch(error){
        res.status(500).json({success:false,error:"Failed to get users"});
    }
})

export default infoRouter;