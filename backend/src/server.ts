import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
 
import connectDB from './config/database';
 
// Routes
import bandRoutes from './routes/band.routes';
import socialLinksRoutes from './routes/social-links.routes';
import streamingLinksRoutes from './routes/streaming-links.routes';
import carouselRoutes from './routes/carouselRoutes';
import aboutRoutes from './routes/aboutRoutes';
import memberRoutes from './routes/memberRoutes';
import tourRoutes from './routes/tour.routes';
import mailingListRoutes from './routes/mailing-list.routes';
import contactRoutes from './routes/contact.routes';
import ringtoneRoutes from './routes/ringtone.routes';
import streamingPlayersRoutes from './routes/streaming-players.routes';
import releaseRoutes from './routes/release.routes';
import youtubeRoutes from './routes/youtube.routes';
import galleryRoutes from './routes/gallery.routes';
import spotifyRoutes from './routes/spotify.routes'; // NEW
 
import { errorHandler } from './middleware/error.middleware';
 
dotenv.config();
connectDB();
 
const app = express();
 
// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
 
// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL as string]
    : ['http://localhost:4200', 'http://127.0.0.1:4200'];
 
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
 
// ─── Helmet / CSP ─────────────────────────────────────────────────────────────
// IMPORTANT: connectSrc must include Spotify's API and accounts domains so
// the Express server can make outbound Spotify token + data requests,
// and so the Angular frontend can call our /api/spotify/* endpoints.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
 
        // Allow images from your app, Spotify CDN (album art), and general https
        imgSrc: [
          "'self'",
          'data:',
          'https:',
          'https://i.scdn.co',         // Spotify album/artist images
        ],
 
        scriptSrc: ["'self'"],
 
        styleSrc: ["'self'", "'unsafe-inline'"],
 
        // Allow your backend to make outbound calls to Spotify
        connectSrc: [
          "'self'",
          'https://api.spotify.com',           // Spotify Web API
          'https://accounts.spotify.com',      // Spotify token endpoint
        ],
 
        // Allow Spotify's Web Playback iframe if you ever embed it
        frameSrc: [
          "'self'",
          'https://open.spotify.com',
        ],
 
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
      },
    },
  })
);
 
// ─── Compression ──────────────────────────────────────────────────────────────
app.use(compression());
 
// ─── Static Assets ────────────────────────────────────────────────────────────
app.use('/assets/gallery', express.static(path.join(__dirname, 'src/assets/gallery')));
 
// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/band', bandRoutes);
app.use('/api/social-links', socialLinksRoutes);
app.use('/api/streaming-links', streamingLinksRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/carousel', carouselRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/mailing-list', mailingListRoutes);
app.use('/api', contactRoutes);
app.use('/api/ringtones', ringtoneRoutes);
app.use('/api/streaming-players', streamingPlayersRoutes);
app.use('/api/releases', releaseRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/spotify', spotifyRoutes);
 
// ─── Error Handler (always last) ─────────────────────────────────────────────
app.use(errorHandler);
 
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
