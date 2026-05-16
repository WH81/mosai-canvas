import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as galleryCtrl from '../controllers/gallery.controller';

const router = Router();

/**
 * PATH CONFIGURATION
 * This resolves the path starting from your backend folder, 
 * climbing up to the project root, and then down into the frontend assets.
 */
const FRONTEND_GALLERY_PATH = path.resolve(process.cwd(), '../frontend/src/assets/gallery');

// Create the directory if it doesn't exist to prevent Multer from throwing an error
if (!fs.existsSync(FRONTEND_GALLERY_PATH)) {
  fs.mkdirSync(FRONTEND_GALLERY_PATH, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    // Pointing directly to the frontend assets folder
    cb(null, FRONTEND_GALLERY_PATH);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    // Generates a unique filename: image-[timestamp]-[random].extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (_req: Request, file: Express.Multer.File, cb: any) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed!"));
  }
});

// Define Endpoints
router.get('/', galleryCtrl.getGallery);
router.post('/', upload.single('image'), galleryCtrl.uploadImage);
router.delete('/:id', galleryCtrl.deleteImage);

export default router;