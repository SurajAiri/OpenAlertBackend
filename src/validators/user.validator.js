import joi from "joi";

const userCreationValidator = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  username: joi
    .string()
    .min(3)
    .max(30)
    .invalid("admin", "dev", "developer")
    .required(),
  firstName: joi.string().min(2).max(20).required(),
  lastName: joi.string().min(2).max(20).required(),
});

const userLoginValidator = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const userUpdateValidator = joi.object({
  email: joi.string().email(),
  name: joi.string().min(2).max(100),
  isActive: joi.boolean(),
});

export { userCreationValidator, userLoginValidator, userUpdateValidator };
