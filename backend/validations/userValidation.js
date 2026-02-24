const Joi = require("joi");

const registerValidation = Joi.object({

  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cannot exceed 30 characters"
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email",
      "string.empty": "Email is required"
    }),

  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*[0-9])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain at least one capital letter and one number",
      "string.empty": "Password is required"
    }),

  role: Joi.string()
    .valid("student", "admin", "hod", "teacher")
    .required()
    .messages({
      "any.only":
        "Role must be one of: student, admin, hod, teacher",
      "string.empty": "Role is required"
    })

});

module.exports = { registerValidation };
