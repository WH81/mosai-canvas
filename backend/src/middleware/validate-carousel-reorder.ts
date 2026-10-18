import {
  NextFunction,
  Request,
  Response,
} from 'express';

import Joi from 'joi';

/**
 * Validation for administrator carousel
 * reorder requests.
 *
 * The client sends the complete ordered list
 * of MongoDB ObjectId values.
 */
const carouselReorderSchema =
  Joi.object({
    ids: Joi.array()
      .items(
        Joi.string()
          .pattern(
            /^[a-fA-F0-9]{24}$/
          )
          .required()
      )
      .min(1)
      .max(100)
      .unique()
      .required()
      .messages({
        'array.base':
          'Carousel IDs must be an array.',

        'array.min':
          'At least one Carousel ID is required.',

        'array.max':
          'A maximum of 100 Carousel items can be reordered at once.',

        'array.unique':
          'Carousel IDs must be unique.',

        'any.required':
          'Carousel IDs are required.',

        'string.pattern.base':
          'Carousel IDs must be valid MongoDB ObjectIds.',
      }),
  })
  .options({
    abortEarly: true,
    allowUnknown: false,
    stripUnknown: true,
  });

export const validateCarouselReorder = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    error,
    value,
  } = carouselReorderSchema.validate(
    req.body
  );

  if (error) {
    res.status(400).json({
      message:
        error.details?.[0]?.message ??
        'Invalid Carousel reorder request.',
    });

    return;
  }

  req.body = value;

  next();
};