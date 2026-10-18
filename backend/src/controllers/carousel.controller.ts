import {
  NextFunction,
  Request,
  Response,
} from 'express';

import mongoose from 'mongoose';

import CarouselItem from '../models/carousel-item.model';

/**
 * Convert YYYY-MM-DD into UTC midnight.
 * Returns undefined when value is empty or omitted.
 */
const parseDateOnly = (
  value: unknown
): Date | undefined => {
  // Empty date is allowed.
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new Error(
      'Invalid date format.'
    );
  }

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/
      .exec(value);

  if (!match) {
    throw new Error(
      'Invalid date format.'
    );
  }

  const year =
    Number(match[1]);

  const month =
    Number(match[2]);

  const day =
    Number(match[3]);

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(
      'Invalid date.'
    );
  }

  return date;
};

/**
 * GET /api/carousel
 */
export const getCarouselItems =
  async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const items =
        await CarouselItem
          .find()
          .sort({
            order: 1,
            createdAt: 1,
          })
          .lean();

      res.status(200).json(
        items
      );
    } catch (error) {
      next(error);
    }
  };

/**
 * GET /api/carousel/:id
 */
export const getCarouselItemById =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } =
      req.params;

    if (
      !id ||
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      res.status(400).json({
        message:
          'Invalid Carousel item ID.',
      });

      return;
    }

    try {
      const item =
        await CarouselItem
          .findById(id)
          .lean();

      if (!item) {
        res.status(404).json({
          message:
            'Carousel item not found.',
        });

        return;
      }

      res.status(200).json(
        item
      );
    } catch (error) {
      next(error);
    }
  };

/**
 * POST /api/carousel
 */
export const createCarouselItem =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        imageUrl,
        bandName,
        songName,
        releaseDate,
        buttonText,
        buttonLink,
      } = req.body;

      const highestOrderItem =
        await CarouselItem
          .findOne()
          .sort({
            order: -1,
          })
          .select({
            order: 1,
          })
          .lean();

      const nextOrder =
        typeof highestOrderItem?.order ===
        'number'
          ? highestOrderItem.order + 1
          : 0;

      const newItem =
        new CarouselItem({
          imageUrl,
          bandName,
          songName,
          releaseDate:
            parseDateOnly(
              releaseDate
            ),
          buttonText,
          buttonLink,
          order:
            nextOrder,
        });

      const savedItem =
        await newItem.save();

      res.status(201).json(
        savedItem
      );
    } catch (error) {
      next(error);
    }
  };

/**
 * PUT /api/carousel/:id
 */
export const updateCarouselItem =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } =
      req.params;

    if (
      !id ||
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      res.status(400).json({
        message:
          'Invalid Carousel item ID.',
      });

      return;
    }

    try {
      const {
        imageUrl,
        bandName,
        songName,
        releaseDate,
        buttonText,
        buttonLink,
      } = req.body;

      const parsedReleaseDate =
        parseDateOnly(
          releaseDate
        );

      const updateQuery: Record<
        string,
        any
      > = {
        $set: {
          imageUrl,
          bandName,
          songName,
          buttonText,
          buttonLink,
        },
      };

      if (parsedReleaseDate === undefined) {
        updateQuery.$unset = {
          releaseDate: 1,
        };
      } else {
        updateQuery.$set.releaseDate =
          parsedReleaseDate;
      }

      const updatedItem =
        await CarouselItem
          .findByIdAndUpdate(
            id,
            updateQuery,
            {
              new: true,
              runValidators: true,
            }
          );

      if (!updatedItem) {
        res.status(404).json({
          message:
            'Carousel item not found.',
        });

        return;
      }

      res.status(200).json(
        updatedItem
      );
    } catch (error) {
      next(error);
    }
  };

/**
 * PUT /api/carousel/order
 */
export const reorderCarouselItems =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        orderedIds,
      } = req.body;

      if (
        !Array.isArray(
          orderedIds
        )
      ) {
        res.status(400).json({
          message:
            'orderedIds must be an array.',
        });

        return;
      }

      if (
        orderedIds.length === 0
      ) {
        res.status(200).json(
          []
        );

        return;
      }

      const invalidId =
        orderedIds.some(
          (id: unknown) =>
            typeof id !==
              'string' ||
            !mongoose.Types.ObjectId.isValid(
              id
            )
        );

      if (invalidId) {
        res.status(400).json({
          message:
            'One or more Carousel item IDs are invalid.',
        });

        return;
      }

      const uniqueIds =
        new Set(
          orderedIds
        );

      if (
        uniqueIds.size !==
        orderedIds.length
      ) {
        res.status(400).json({
          message:
            'Duplicate Carousel item IDs are not allowed.',
        });

        return;
      }

      const existingItems =
        await CarouselItem
          .find({
            _id: {
              $in: orderedIds,
            },
          })
          .select({
            _id: 1,
          })
          .lean();

      if (
        existingItems.length !==
        orderedIds.length
      ) {
        res.status(400).json({
          message:
            'The submitted Carousel order does not match the existing Carousel items.',
        });

        return;
      }

      const operations =
        orderedIds.map(
          (
            id: string,
            index: number
          ) => ({
            updateOne: {
              filter: {
                _id: id,
              },
              update: {
                $set: {
                  order:
                    index,
                },
              },
            },
          })
        );

      await CarouselItem.bulkWrite(
        operations,
        {
          ordered: true,
        }
      );

      const items =
        await CarouselItem
          .find()
          .sort({
            order: 1,
            createdAt: 1,
          })
          .lean();

      res.status(200).json(
        items
      );
    } catch (error) {
      next(error);
    }
  };

/**
 * DELETE /api/carousel/:id
 */
export const deleteCarouselItem =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } =
      req.params;

    if (
      !id ||
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      res.status(400).json({
        message:
          'Invalid Carousel item ID.',
      });

      return;
    }

    try {
      const deletedItem =
        await CarouselItem
          .findByIdAndDelete(
            id
          );

      if (!deletedItem) {
        res.status(404).json({
          message:
            'Carousel item not found.',
        });

        return;
      }

      res.status(200).json(
        deletedItem
      );
    } catch (error) {
      next(error);
    }
  };