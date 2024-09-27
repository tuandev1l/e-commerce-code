import * as Joi from 'joi';

export const ConfigValidationSchema = Joi.object({
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  // DB_DATABASE: Joi.string().required(),
  // DB_SYNCHRONIZE: Joi.boolean().required(),
  // JWT_SECRET: Joi.string().required(),
  // JWT_EXPIRE: Joi.string().required(),
  // REFRESH_SECRET: Joi.string().required(),
  // REFRESH_EXPIRE: Joi.string().required(),
});
