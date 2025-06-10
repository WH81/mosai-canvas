import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./config/database";
import bandRoutes from './routes/band.routes';
import socialLinksRoutes from './routes/social-links.routes';
import streamingLinksRoutes from './routes/streaming-links.routes';
import carouselRoutes from "./routes/carouselRoutes";
import aboutRoutes from "./routes/aboutRoutes";
import memberRoutes from './routes/memberRoutes';
import { errorHandler } from './middleware/error.middleware';
import tourRoutes from './routes/tour.routes';
import mailingListRoutes from "./routes/mailing-list.routes";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

app.use('/api/bands', bandRoutes);
app.use('/api/social-links', socialLinksRoutes);
app.use('/api/streaming-links', streamingLinksRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/about", aboutRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/mailing-list', mailingListRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
