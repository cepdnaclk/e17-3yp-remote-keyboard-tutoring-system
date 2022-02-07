/* Schema validation */
const Joi = require('@hapi/joi');

// register validation
const registerValidation = (data) => {
    const schema = Joi.object({
        firstName : Joi.string().min(3).required().messages({
            'string.base': `'firstName' should be a type of 'text'`,
            'string.min': `'firstName' should have a minimum length of 3`,
            'any.required': `'firstName' is a required field`
          }),
        lastName : Joi.string().min(3).required().messages({
            'string.base': `'lastName' should be a type of 'text'`,
            'string.min': `'lastName' should have a minimum length of 3`,
            'any.required': `'lastName' is a required field`
          }),
        email : Joi.string().min(6).required().email().messages({
            'string.email': `'email' should be a valid email`,
            'string.min': `'email' should have a minimum length of 6`,
            'any.required': `'email' is a required field`
          }),
        username : Joi.string().min(6).required().messages({
            'string.base': `'username' should be a type of 'text'`,
            'string.min': `'username' should have a minimum length of 6`,
            'any.required': `'username' is a required field`
          }),
        password : Joi.string().min(8).required().messages({
            'string.base': `'password' should be a type of 'text'`,
            'string.min': `'password' should have a minimum length of 8`,
            'any.required': `'password' is a required field`
          }),
        DOB : Joi.date().required().messages({
            'date.base': `'DOB' should be a type of 'date'`,
            'any.required': `'DOB' is a required field`
          }),
        phone : Joi.string().min(10).allow(null, ''),
        country : Joi.string().min(5).required().messages({
            'string.base': `'country' should be a type of 'text'`,
            'string.min': `'country' should have a minimum length of 5`,
            'any.required': `'country' is a required field`
          }),
        deviceID : Joi.string().min(5).allow(null, '')
    });

    const {error} = schema.validate(data);
    return error;
}

// login validation
const loginValidation = (data) => {
    const schema = Joi.object({
        login : Joi.alternatives().try(
            Joi.string().min(6).email(),
            Joi.string().min(6)).required().messages({
                'string.base': `'login' should be a type of 'text'`,
                'string.min': `'login' should have a minimum length of 6`,
                'any.required': `'login' is a required field`
              }),
        password : Joi.string().min(8).required().messages({
            'string.base': `'password' should be a type of 'text'`,
            'string.min': `'password' should have a minimum length of 8`,
            'any.required': `'password' is a required field`
          })
    });

    const {error} = schema.validate(data);
    return error;
}

module.exports = {
    registerValidation,
    loginValidation
}