const Joi = require('joi');

module.exports.mountainSchema = Joi.object({
    mountain: Joi.object({
        title: Joi.string().required(),
        height: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});
