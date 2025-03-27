import { NextFunction, Request, Response } from "express";
import CarouselItem from "../models/CarouselItem";
import mongoose from "mongoose";

// Get all carousel items
export const getCarouselItems = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await CarouselItem.find();
    res.json(items);
  } catch (error) {
      next(error);
  }
  return;
};

// Get a single carousel item by ID
export const getCarouselItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const item = await CarouselItem.findById(req.params.id);
      if (!item) {
          res.status(404).json({ error: "Item not found" });
          return;
      }
      res.json(item); // No return statement needed
  } catch (error) {
      next(error);
  }
};

// Create a new carousel item
export const createCarouselItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { imageUrl, bandName, songName, releaseDate, buttonText, buttonLink } = req.body;

  // Ensure all required fields are provided
  if (!imageUrl || !bandName || !songName || !releaseDate || !buttonText || !buttonLink) {
    res.status(400).json({ message: "Missing required fields" });
    return; // 🔴 Important: Stop further execution
  }

  const newItem = new CarouselItem({
    imageUrl,
    bandName,
    songName,
    releaseDate,
    buttonText,
    buttonLink,
  });

  try {
    // Save the new item to the database
    const savedItem = await newItem.save();
    res.status(201).json(savedItem); // Return the saved item with a 201 status
  } catch (error) {
    // Catch validation or other errors and respond with a 500 error
    next(error); // 🔵 Use `next(error)` to let Express error middleware handle it
  }
};

// Update an existing carousel item
export const updateCarouselItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { imageUrl, bandName, songName, releaseDate, buttonText, buttonLink } = req.body;

  // Validate request body
  if (!imageUrl || !bandName || !songName || !releaseDate || !buttonText || !buttonLink) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    // Update the carousel item
    const updatedItem = await CarouselItem.findByIdAndUpdate(
      id,
      { imageUrl, bandName, songName, releaseDate, buttonText, buttonLink },
      { new: true }
    );

    // If the item is not found
    if (!updatedItem) {
      res.status(404).json({ message: "Carousel item not found" });
      return;
    }

    // Return the updated item
    res.json(updatedItem);
  } catch (error) {
    console.error(error); // Log error for debugging
    next(error); // Pass the error to the next middleware (error handler)
  }
};

// Delete a carousel item
export const deleteCarouselItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  // Validate if the ID is provided and is a valid MongoDB ObjectId
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid ID format" });
    return;
  }

  try {
    // Attempt to delete the carousel item by ID
    const deletedItem = await CarouselItem.findByIdAndDelete(id);

    if (!deletedItem) {
      res.status(404).json({ message: "Carousel item not found" });
      return;
    }

    // Return a 204 No Content status indicating successful deletion
    res.status(204).send();
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(error); // Pass the error to the next middleware (error handler)
  }
};
