import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import Gallery from '../models/gallery.model';

/**
 * GET: Retrieve all gallery items
 */
export const getGallery = async (_req: Request, res: Response) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery", error });
  }
};

/**
 * POST: Upload a new art piece
 */
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No image file provided" });
      return; 
    }

    const newArt = new Gallery({
      title: req.body.title,
      artist: req.body.artist,
      category: req.body.category || 'Art',
      imageUrl: `assets/gallery/${req.file.filename}`,
      altText: req.body.altText || req.body.title
    });

    await newArt.save();
    res.status(201).json(newArt);
  } catch (error) {
    res.status(500).json({ message: "Database save failed", error });
  }
};

/**
 * PUT: Update an existing art piece
 * Handles text updates and optional file replacement
 */
export const updateImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 1. Prepare the update object with text fields
    const updateData: any = {
      title: req.body.title,
      artist: req.body.artist,
      category: req.body.category,
      altText: req.body.altText
    };

    // 2. If a new file is included, delete the old one and update the path
    if (req.file) {
      const oldItem = await Gallery.findById(id);
      if (oldItem) {
        const oldFilePath = path.join(process.cwd(), 'src', oldItem.imageUrl);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      updateData.imageUrl = `assets/gallery/${req.file.filename}`;
    }

    // 3. Update the database record
    const updatedArt = await Gallery.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedArt) {
      res.status(404).json({ message: "Art piece not found" });
      return;
    }

    res.status(200).json(updatedArt);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

/**
 * DELETE: Remove an art piece
 */
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const item = await Gallery.findById(req.params.id);
    
    if (!item) {
      res.status(404).json({ message: "Art piece not found" });
      return;
    }

    const filePath = path.join(process.cwd(), 'src', item.imageUrl);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Art removed from the collective" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};