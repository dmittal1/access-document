import Joi from '@hapi/joi';

//VALIDATION

//Register Validation 

const registerValidation = data => {
    const schema = {
        name: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    };

    return Joi.validate(data, schema);
};

const loginValidation = data => {
    const schema = {
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    };

    return Joi.validate(data, schema);
};

export {registerValidation, loginValidation};