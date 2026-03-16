import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

    PORT: Joi.number().default(3000),

    CLIENT_URL: Joi.string().uri().required(),

    DATABASE_URL: Joi.string().required(),

    JWT_SECRET: Joi.string().min(16).required(),
    JWT_EXPIRES_IN: Joi.string().default('7d'),

    UPSTASH_REDIS_URL: Joi.string().required(),

    CLOUDINARY_CLOUD_NAME: Joi.string().required(),
    CLOUDINARY_API_KEY: Joi.string().required(),
    CLOUDINARY_API_SECRET: Joi.string().required(),

    GEMINI_API_KEY: Joi.string().required(),
});