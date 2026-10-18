import {
  NextFunction,
  Request,
  Response,
} from 'express';

import mongoose from 'mongoose';

import About from '../models/about.model';

/**
 * Get all About items.
 *
 * Public because the website needs to display About content.
 */
export const getAbout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await About
      .find()
      .sort({ _id: 1 })
      .lean();

    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single About item by ID.
 */
export const getAboutById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  if (
    !id ||
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    res.status(400).json({
      message: 'Invalid About ID.',
    });

    return;
  }

  try {
    const item = await About
      .findById(id)
      .lean();

    if (!item) {
      res.status(404).json({
        message: 'About item not found.',
      });

      return;
    }

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new About item.
 *
 * Authentication should happen in the route middleware
 * before this controller is reached.
 */
export const createAbout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      body,
    } = req.body;

    const newItem = new About({
      ...(title
        ? { title: title.trim() }
        : {}),
      body: body.trim(),
    });

    const savedItem =
      await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing About item.
 */
export const updateAbout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  if (
    !id ||
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    res.status(400).json({
      message: 'Invalid About ID.',
    });

    return;
  }

  try {
    const {
      title,
      body,
    } = req.body;

    const update: {
      $set: {
        body: string;
        title?: string;
      };
      $unset?: {
        title: 1;
      };
    } = {
      $set: {
        body: body.trim(),
      },
    };

    if (
      typeof title === 'string' &&
      title.trim().length > 0
    ) {
      update.$set.title = title.trim();
    } else {
      update.$unset = {
        title: 1,
      };
    }

    const updatedItem =
      await About.findByIdAndUpdate(
        id,
        update,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedItem) {
      res.status(404).json({
        message: 'About item not found.',
      });

      return;
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an About item.
 *
 * Authentication happens at the route level.
 */
export const deleteAbout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  if (
    !id ||
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    res.status(400).json({
      message: 'Invalid About ID.',
    });

    return;
  }

  try {
    const deletedItem =
      await About.findByIdAndDelete(id);

    if (!deletedItem) {
      res.status(404).json({
        message: 'About item not found.',
      });

      return;
    }

    /*
     * Return the deleted document.
     *
     * Using 200 instead of 204 makes the Angular
     * operation unambiguous and easier to debug.
     */
    res.status(200).json(deletedItem);
  } catch (error) {
    next(error);
  }
};