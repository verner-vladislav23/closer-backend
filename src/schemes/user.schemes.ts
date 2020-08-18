const Joi = require('@hapi/joi');

export const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@$!%*#?&]{3,30}$')).required()
})

export const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@$!%*#?&]{3,30}$')).required(),
    email: Joi.string().email().max(60).required()
})

export const updateProfile = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    //description: Joi.string().max(1024).required(),
    email: Joi.string().email().max(60).required()
})

export const updateLocation = Joi.object({
    location: {
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }
})

export const changePassword = Joi.object({
    oldPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@$!%*#?&]{3,30}$')).required(),
    newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@$!%*#?&]{3,30}$')).required()
})