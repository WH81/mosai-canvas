import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const urlSchema = Joi.string()
  .trim()
  .max(500)
  .pattern(/^https?:\/\/.+$/)
  .allow('')
  .messages({
    'string.max': 'Streaming link URLs must not exceed 500 characters.',
    'string.pattern.base':
      'Streaming link URLs must begin with http:// or https://.',
  });

const streamingLinksSchema = Joi.object({
  spotify: urlSchema,
  appleMusic: urlSchema,
  soundCloud: urlSchema,
})
  .unknown(false)
  .default({});

export const validateStreamingLinks = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error, value } = streamingLinksSchema.validate(req.body, {
    abortEarly: false,
    convert: true,
    stripUnknown: false,
  });

  if (error) {
    res.status(400).json({
      message: 'Invalid streaming links data.',
      errors: error.details.map((detail) => detail.message),
    });

    return;
  }

  req.body = value;
  next();
};