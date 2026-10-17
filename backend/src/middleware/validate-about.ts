import {
  NextFunction,
  Request,
  Response,
} from 'express';

import Joi from 'joi';

/**
 * Server-side validation for About content.
 *
 * Security principle:
 * Never rely on Angular validation alone.
 *
 * The API must validate every request independently.
 */
const aboutSchema = Joi.object({
  /**
   * Title is optional.
   *
   * Empty strings are converted to undefined so that
   * an omitted title and an empty title are treated consistently.
   */
  title: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max':
        'Title must be 100 characters or fewer.',
    }),

  /**
   * Body remains required.
   */
  body: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.empty':
        'About body is required.',

      'any.required':
        'About body is required.',

      'string.min':
        'About body is required.',

      'string.max':
        'About body must be 2000 characters or fewer.',
    }),
}).options({
  abortEarly: true,
  allowUnknown: false,
  stripUnknown: true,
});

/**
 * Validate About requests before create/update handlers.
 */
export const validateAbout = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    error,
    value,
  } = aboutSchema.validate(req.body);

  if (error) {
    res.status(400).json({
      message:
        error.details?.[0]?.message ??
        'Validation error.',
    });

    return;
  }

  /*
   * Replace the request body with the sanitized Joi result.
   *
   * This prevents unexpected properties from reaching
   * the controller/database.
   */
  req.body = value;

  next();
};