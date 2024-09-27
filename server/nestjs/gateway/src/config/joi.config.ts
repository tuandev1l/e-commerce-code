import * as Joi from 'joi';

export const config = Joi.object({
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_SYNCHRONIZE: Joi.boolean().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.string().required(),
  PASSWORD_SALT_LENGTH: Joi.number().required(),
});
