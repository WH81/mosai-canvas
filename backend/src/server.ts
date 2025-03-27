import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./config/database";
import bandRoutes from "./routes/bandRoutes";
import carouselRoutes from "./routes/carouselRoutes";
import aboutRoutes from "./routes/aboutRoutes";
import memberRoutes from './routes/memberRoutes';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

app.use("/api/bands", bandRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/members", memberRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
