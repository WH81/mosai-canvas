import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const memberSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required(),

  instrument: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required(),

  band: Joi.string()
    .trim()
    .required(),

  image: Joi.string()
    .trim()
    .max(500)
    .required(),

  bio: Joi.string()
    .trim()
    .max(10000)
    .required(),

  socialLinks: Joi.object({
    facebook: Joi.string().trim().max(500).pattern(/^https?:\/\/.+$/).allow(''),
    instagram: Joi.string().trim().max(500).pattern(/^https?:\/\/.+$/).allow(''),
    x: Joi.string().trim().max(500).pattern(/^https?:\/\/.+$/).allow(''),
    youtube: Joi.string().trim().max(500).pattern(/^https?:\/\/.+$/).allow(''),
    tiktok: Joi.string().trim().max(500).pattern(/^https?:\/\/.+$/).allow(''),
  }).unknown(false),

  streamingLinks: Joi.object({
    spotify: Joi.string().trim().max(500).pattern(/^https?:\/\/.+$/).allow(''),
    appleMusic: Joi.string().trim().max(500).pattern(/^https?:\/\/.+$/).allow(''),
    soundCloud: Joi.string().trim().max(500).pattern(/^https?:\/\/.+$/).allow(''),
  }).unknown(false),
}).unknown(false);

const batchMemberSchema = Joi.array()
  .items(memberSchema)
  .min(1)
  .max(100);

export const validateMember = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error, value } = memberSchema.validate(req.body, {
    abortEarly: false,
    convert: true,
    stripUnknown: false,
  });

  if (error) {
    res.status(400).json({
      message: 'Invalid member data.',
      errors: error.details.map((detail) => detail.message),
    });

    return;
  }

  req.body = value;
  next();
};

export const validateMemberBatch = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error, value } = batchMemberSchema.validate(req.body, {
    abortEarly: false,
    convert: true,
    stripUnknown: false,
  });

  if (error) {
    res.status(400).json({
      message: 'Invalid member batch data.',
      errors: error.details.map((detail) => detail.message),
    });

    return;
  }

  req.body = value;
  next();
};