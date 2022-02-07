/* Schema validation */
const Joi = require('@hapi/joi');

// course creation validation
const courseCreateValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(8).required(),
        description: Joi.string().min(3).required(),
        difficulty: Joi.string().valid('Beginner', 'Intermediate', 'Expert').required(),
        isPublished: Joi.boolean().required(),
        syllabus: Joi.array().items(Joi.string()),
        category: Joi.string().required(),
        searchTags: Joi.array().items(Joi.string()),
        prerequisites: Joi.array().items(Joi.string().allow(null, '')),
        price: Joi.number().required(),
    });

    const { error } = schema.validate(data);
    return error;
};

module.exports = {
    courseCreateValidation
};