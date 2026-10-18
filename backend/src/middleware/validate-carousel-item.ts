import {
  NextFunction,
  Request,
  Response,
} from 'express';

import Joi from 'joi';

const carouselItemSchema =
  Joi.object({
    imageUrl: Joi.string()
      .trim()
      .uri({
        scheme: [
          'http',
          'https',
        ],
      })
      .max(2048)
      .required()
      .messages({
        'string.empty':
          'Image URL is required.',
        'string.uri':
          'Image URL must be a valid HTTP or HTTPS URL.',
        'string.max':
          'Image URL must be 2048 characters or fewer.',
        'any.required':
          'Image URL is required.',
      }),

    bandName: Joi.string()
      .trim()
      .allow('')
      .optional()
      .max(100)
      .messages({
        'string.max':
          'Band name must be 100 characters or fewer.',
      }),

    songName: Joi.string()
      .trim()
      .allow('')
      .optional()
      .max(100)
      .messages({
        'string.max':
          'Song name must be 100 characters or fewer.',
      }),

    releaseDate: Joi.string()
      .trim()
      .allow('', null)
      .optional()
      .pattern(
        /^\d{4}-\d{2}-\d{2}$/
      )
      .messages({
        'string.pattern.base':
          'Release date must use YYYY-MM-DD format.',
      }),

    buttonText: Joi.string()
      .trim()
      .allow('')
      .optional()
      .max(50)
      .messages({
        'string.max':
          'Button text must be 50 characters or fewer.',
      }),

    buttonLink: Joi.string()
      .trim()
      .allow('')
      .optional()
      .max(2048)
      .custom((value, helpers) => {
        if (!value) {
          return value;
        }

        const uriSchema = Joi.string().uri({
          scheme: ['http', 'https'],
        });

        const { error } = uriSchema.validate(value);
        if (error) {
          return helpers.error('string.uri');
        }

        return value;
      })
      .messages({
        'string.uri':
          'Button link must be a valid HTTP or HTTPS URL.',
        'string.max':
          'Button link must be 2048 characters or fewer.',
      }),
  })
  .options({
    abortEarly: true,
    allowUnknown: false,
    stripUnknown: true,
  });

const carouselOrderSchema =
  Joi.object({
    orderedIds: Joi.array()
      .items(
        Joi.string()
          .hex()
          .length(24)
          .required()
      )
      .min(0)
      .max(100)
      .unique()
      .required(),
  })
  .options({
    abortEarly: true,
    allowUnknown: false,
    stripUnknown: true,
  });

export const validateCarouselItem = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    error,
    value,
  } =
    carouselItemSchema.validate(
      req.body
    );

  if (error) {
    res.status(400).json({
      message:
        error.details?.[0]?.message ??
        'Validation error.',
    });

    return;
  }

  req.body = value;

  next();
};

export const validateCarouselOrder = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    error,
    value,
  } =
    carouselOrderSchema.validate(
      req.body
    );

  if (error) {
    res.status(400).json({
      message:
        error.details?.[0]?.message ??
        'Invalid Carousel order.',
    });

    return;
  }

  req.body = value;

  next();
};