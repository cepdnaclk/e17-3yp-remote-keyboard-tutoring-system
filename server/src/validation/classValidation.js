/* Schema validation */
const Joi = require('@hapi/joi');

const classValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        password: Joi.string().min(6).required(),
        allowedUsers: Joi.array().items(Joi.string()),
        host: Joi.string().required(),
        maxParticipants: Joi.number().integer().min(5),
        course: Joi.string().required(),
    });

    const { error } = schema.validate(data);
    return error;
};

const joinValidation = (data) => {
    const schema = Joi.object({
        roomId: Joi.string().required(),
        password: Joi.string().required(),
        username: Joi.string().required(),
    });

    const { error } = schema.validate(data);
    return error;
};

module.exports = {
    classValidation,
    joinValidation,
};