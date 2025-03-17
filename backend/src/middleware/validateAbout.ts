import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Define the validation schema with Joi
const aboutSchema = Joi.object({
  title: Joi.string().max(100).required().messages({
    "string.max": "Title name must be less than 100 characters",
    "any.required": "Title name is required"
  }),
  body: Joi.string().max(500).required().messages({
    "string.max": "About body must be less than 500 characters",
    "any.required": "About body is required"
  }),
});

export const validateAbout = (req: Request, res: Response, next: NextFunction): void => {
  // Validate the request body against the schema
  const { error } = aboutSchema.validate(req.body);

  if (error) {
    // Send the validation error message
    res.status(400).json({ message: error.details?.[0]?.message || "Validation error" });
    return; // Stop further execution after sending the error response
  }

  // If validation is successful, pass control to the next middleware
  next();
};
