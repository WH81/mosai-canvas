import express from "express";
import { getBands } from "../controllers/bandController";

const router = express.Router();

router.get("/", getBands);

export default router;
