import { NextFunction, Request, Response } from "express";
import About from "../models/About";
import mongoose from "mongoose";

// Get all about items
export const getAbout = async (_: Request, res: Response) => {
  try {
    const items = await About.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
  return;
};

// Get a single about item by ID
export const getAboutById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const item = await About.findById(req.params.id);
      if (!item) {
          res.status(404).json({ error: "Item not found" });
          return;
      }
      res.json(item); // No return statement needed
  } catch (error) {
      next(error);
  }
};

// Create a new about item
export const createAbout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, body } = req.body;

  // Ensure all required fields are provided
  if (!title || !body) {
    res.status(400).json({ message: "Missing required fields" });
    return; // 🔴 Important: Stop further execution
  }

  const newItem = new About({
    title,
    body,
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

// Update an existing about item
export const updateAbout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { title, body } = req.body;

  // Validate request body
  if (!title || !body) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    // Update the about item
    const updatedItem = await About.findByIdAndUpdate(
      id,
      { title, body },
      { new: true }
    );

    // If the item is not found
    if (!updatedItem) {
      res.status(404).json({ message: "About item not found" });
      return;
    }

    // Return the updated item
    res.json(updatedItem);
  } catch (error) {
    console.error(error); // Log error for debugging
    next(error); // Pass the error to the next middleware (error handler)
  }
};

// Delete a about item
export const deleteAbout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  // Validate if the ID is provided and is a valid MongoDB ObjectId
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid ID format" });
    return;
  }

  try {
    // Attempt to delete the about item by ID
    const deletedItem = await About.findByIdAndDelete(id);

    if (!deletedItem) {
      res.status(404).json({ message: "About item not found" });
      return;
    }

    // Return a 204 No Content status indicating successful deletion
    res.status(204).send();
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(error); // Pass the error to the next middleware (error handler)
  }
};
