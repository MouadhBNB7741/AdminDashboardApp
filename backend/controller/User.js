import { Router } from "express";
import client from "../services/prisma";

const userRouter = Router();

userRouter.get("/", async (req, res) => {});

export default userRouter;
