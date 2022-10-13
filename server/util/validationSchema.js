const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")

const orgSignUpBodyValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string(),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(body);
};

const logInBodyValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    });
    return schema.validate(body);
};

const eventBodyValidation = (body) => {
    const schema = Joi.object({
        orgId: Joi.allow(),
        adminEmail: Joi.string(),
        eventTitle: Joi.string(),
        eventDescription: Joi.string(),
        eventStartDate: Joi.date(),
        eventDuration: Joi.number(),
        orgTeam: Joi.array()
    })
    return schema.validate(body);
}

module.exports = {
    orgSignUpBodyValidation,
    logInBodyValidation,
    refreshTokenBodyValidation,
    eventBodyValidation
};