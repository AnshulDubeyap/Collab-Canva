import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  avatar: Joi.string().uri().optional(),
});

export const requestEmailChangeSchema = Joi.object({
  newEmail: Joi.string().email().required(),
  currentPassword: Joi.string().optional(), // Optional because Google users won't have it
});

export const verifyEmailChangeSchema = Joi.object({
  token: Joi.string().required(),
});
