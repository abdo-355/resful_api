import { Resolver, Mutation, Arg } from "type-graphql";
import "reflect-metadata";
import bcrypt from "bcrypt";
import validator from "validator";

import { userInput } from "../schemas/userInput";
import userSchema from "../schemas/user";
import User from "../../models/user";
import ResponseError from "../../utils/responseError";

@Resolver()
class userResolver {
  @Mutation(() => userSchema)
  async createUser(@Arg("Input") userInput: userInput) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-mail is invalid" });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password is too short" });
    }

    if (errors.length > 0) {
      const error: ResponseError = new Error("invalid input");
      error.statusCode = 422;
      error.data = errors;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const { name, email, password } = userInput;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const createdUser = await user.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  }
}

export default userResolver;
