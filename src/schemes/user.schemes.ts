const Joi = require('@hapi/joi');

export const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@$!%*#?&]{3,30}$')).required()
})

export const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@$!%*#?&]{3,30}$')).required(),
    email: Joi.string().email().required()
})

export const updateLocation = Joi.object({
    location: {
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }
})