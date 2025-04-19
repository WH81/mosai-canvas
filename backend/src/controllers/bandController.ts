import { Request, Response } from "express";
import Band from "../models/Band";

export const getBands = async (_req: Request, res: Response) => {
  try {
    const bands = await Band.find().populate("members");
    res.json(bands);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
