import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  avatar: Joi.string().uri().optional(),
});

export const requestEmailChangeSchema = Joi.object({
  newEmail: Joi.string().email().required(),
});

export const verifyEmailChangeSchema = Joi.object({
  token: Joi.string().required(),
});
