import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Define the validation schema with Joi
const carouselItemSchema = Joi.object({
  imageUrl: Joi.string().uri().required().messages({
    "string.uri": "Invalid image URL format",
    "any.required": "Image URL is required"
  }),
  bandName: Joi.string().max(100).required().messages({
    "string.max": "Band name must be less than 100 characters",
    "any.required": "Band name is required"
  }),
  songName: Joi.string().max(100).required().messages({
    "string.max": "Song name must be less than 100 characters",
    "any.required": "Song name is required"
  }),
  releaseDate: Joi.string().isoDate().required().messages({
    "string.isoDate": "Invalid release date format. Use ISO 8601 format (e.g., YYYY-MM-DD)",
    "any.required": "Release date is required"
  }),
  buttonText: Joi.string().max(50).optional().messages({
    "string.max": "Button text must be less than 50 characters"
  }),
  buttonLink: Joi.string().uri().optional().messages({
    "string.uri": "Invalid button link URL format"
  }),
});

export const validateCarouselItem = (req: Request, res: Response, next: NextFunction): void => {
  // Validate the request body against the schema
  const { error } = carouselItemSchema.validate(req.body);

  if (error) {
    // Send the validation error message
    res.status(400).json({ message: error.details?.[0]?.message || "Validation error" });
    return; // Stop further execution after sending the error response
  }

  // If validation is successful, pass control to the next middleware
  next();
};
