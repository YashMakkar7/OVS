import dotenv from "dotenv";
import express from "express";
import authRouter from "./Routes/auth";
import electionRouter from "./Routes/election";
import mongoose from "mongoose";
import candidateRouter from "./Routes/candidate";
dotenv.config();
const app = express();

//Middlewares
app.use(express.json());

//Routes
app.use("/auth", authRouter);
app.use("/election", electionRouter);
app.use("/candidate", candidateRouter);

const StartDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

const StartServer = async () => {
  await StartDatabase().then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  });
};

StartServer();
