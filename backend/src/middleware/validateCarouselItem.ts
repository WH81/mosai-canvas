import { Request, Response, NextFunction } from "express";

export const validateCarouselItem = (req: Request, res: Response, next: NextFunction): void => {
  const { imageUrl, bandName, songName, releaseDate, buttonText, buttonLink } = req.body;

  // Check if all required fields are provided
  if (!imageUrl || !bandName || !songName || !releaseDate || !buttonText || !buttonLink) {
    res.status(400).json({ message: "Missing required fields" });
    return; // Explicitly return to prevent execution from continuing
  }

  // If validation is successful, pass control to the next middleware
  next();
};
