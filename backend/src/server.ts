import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';

// Import your existing DB connection logic
import connectDB from './config/database';

// Import your Routes
import bandRoutes from './routes/band.routes';
import socialLinksRoutes from './routes/social-links.routes';
import streamingLinksRoutes from './routes/streaming-links.routes';
import carouselRoutes from './routes/carouselRoutes';
import aboutRoutes from './routes/aboutRoutes';
import memberRoutes from './routes/memberRoutes';
import tourRoutes from './routes/tour.routes';
import mailingListRoutes from './routes/mailing-list.routes';
import contactRoutes from './routes/contact.routes';
import ringtoneRoutes from "./routes/ringtone.routes";
import streamingPlayersRoutes from './routes/streaming-players.routes';
import releaseRoutes from './routes/release.routes';
import youtubeRoutes from './routes/youtube.routes';
import galleryRoutes from './routes/gallery.routes';

// Middleware
import { errorHandler } from './middleware/error.middleware';

dotenv.config();
connectDB(); // This handles the Atlas connection using the .env file

const app = express();

// Standard Middleware
//app.use(express.json());
app.use(express.json({ limit: '10kb' }));


// app.use(cors());
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL as string]
    : ['http://localhost:4200', 'http://127.0.0.1:4200'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// app.use(helmet({ contentSecurityPolicy: false })); // Allows local images to load
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        // Only allow images from your app + secure external sources
        imgSrc: [
          "'self'",
          "data:",
          "https:"
        ],

        // Restrict scripts to your own domain
        scriptSrc: [
          "'self'"
        ],

        // Safer style handling (avoid unsafe-inline if possible later)
        styleSrc: [
          "'self'",
          "'unsafe-inline'"
        ],

        // Prevent embedding your site in iframes (clickjacking protection)
        frameAncestors: ["'none'"],

        // Block everything not explicitly allowed
        objectSrc: ["'none'"],

        // Restrict where forms can submit data
        formAction: ["'self'"],

        // Lock down base URI injection attacks
        baseUri: ["'self'"]
      }
    }
  })
);

app.use(compression());

/**
 * STATIC IMAGES
 * Based on your screenshot, the server.ts is OUTSIDE src. 
 * This path points correctly to your gallery folder.
 */
app.use('/assets/gallery', express.static(path.join(__dirname, 'src/assets/gallery')));

// API Routes
app.use('/api/band', bandRoutes);
app.use('/api/social-links', socialLinksRoutes);
app.use('/api/streaming-links', streamingLinksRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/about", aboutRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/mailing-list', mailingListRoutes);
app.use('/api', contactRoutes);
app.use("/api/ringtones", ringtoneRoutes);
app.use('/api/streaming-players', streamingPlayersRoutes);
app.use('/api/releases', releaseRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/gallery', galleryRoutes);

// Error Handler (Always last)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
