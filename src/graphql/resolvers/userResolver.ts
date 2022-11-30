import { Resolver, Mutation, Arg } from "type-graphql";
import "reflect-metadata";
import bcrypt from "bcrypt";

import { userInput } from "../schemas/userInput";
import userSchema from "../schemas/user";
import User from "../../models/user";

@Resolver()
class userResolver {
  @Mutation(() => userSchema)
  async createUser(@Arg("Input") userInput: userInput) {
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
