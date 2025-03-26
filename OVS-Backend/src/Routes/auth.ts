import { Request, Response, Router } from "express";
import { authMiddleware } from "../Middleware/middleware";
import { z } from "zod";
import bcrypt from "bcrypt";
const authRouter = Router();
import { User } from "../db";
const requiredBody = z.object({
  username: z.string().min(1).max(20),
  email: z.string().email(),
  password: z
    .string()
    .min(3)
    .regex(/[A-Z]/, "Password must contain one uppercase")
    .regex(/[a-z]/, "Password must contain one Lowercase")
    .regex(/[0-9]/, "Password must contain one Digit"),
  adharId: z.string().min(10),
});
import jwt from "jsonwebtoken";

authRouter.post("/signup", async (req: Request, res: Response) => {
  const parsedBody = requiredBody.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      msg: "Invalid Input Data",
      err: parsedBody.error.format(),
    });
    return;
  }

  const { username, email, password, adharId } = parsedBody.data;
  const hashedPassword = await bcrypt.hash(password, 3);

  try {
    await User.create({
      username,
      email,
      password: hashedPassword,
      adharId,
    });
  } catch (e) {
    res.status(500).json({
      msg: "Signup Failed",
    });
  }

  res.json({
    msg: "Signup Successfully",
  });
});

authRouter.post("/signin", async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({email});

    if(!user){
        res.status(400).json({
            msg:"Invalid Email or Password"
        })
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        res.status(400).json({
            msg:"Invalid Email or Password"
        })
        return;
    }
    
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET!, {expiresIn:"1d"});
        
    res.json({
        msg:"Signin Successfully",
        token
    })
})


authRouter.get("/protected", authMiddleware, (req: Request, res: Response) => {
    res.json({
        msg:"Protected Route",
        userId:req.body.userId
    })
})

export { authRouter };
