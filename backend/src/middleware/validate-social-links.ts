import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const urlSchema = Joi.string()
  .trim()
  .max(500)
  .pattern(/^https?:\/\/.+$/)
  .allow('')
  .messages({
    'string.max': 'Social link URLs must not exceed 500 characters.',
    'string.pattern.base':
      'Social link URLs must begin with http:// or https://.',
  });

const socialLinksSchema = Joi.object({
  facebook: urlSchema,
  instagram: urlSchema,
  x: urlSchema,
  youtube: urlSchema,
  tiktok: urlSchema,
})
  .unknown(false)
  .default({});

export const validateSocialLinks = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error, value } = socialLinksSchema.validate(req.body, {
    abortEarly: false,
    convert: true,
    stripUnknown: false,
  });

  if (error) {
    res.status(400).json({
      message: 'Invalid social links data.',
      errors: error.details.map((detail) => detail.message),
    });

    return;
  }

  req.body = value;
  next();
};