import { Mutation, Resolver, Arg, Ctx } from "type-graphql";
import validator from "validator";

import { Context } from "../../types/types";
import Post from "../../models/post";
import postSchema from "../schemas/post";
import ResponseError from "../../utils/responseError";
import User from "../../models/user";

@Resolver()
class postResolver {
  @Mutation(() => postSchema)
  async createPost(
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Arg("imgUrl") imgUrl: string,
    @Ctx() { req }: Context
  ) {
    if (req.isAuth) {
      const error: ResponseError = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    const errors: { message: string }[] = [];

    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: "Title is invalid" });
    }

    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid" });
    }

    if (errors.length > 0) {
      const error: ResponseError = new Error("invalid input");
      error.statusCode = 422;
      error.data = errors;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error: ResponseError = new Error("Invalid user");
      error.statusCode = 422;
      throw error;
    }

    const post = new Post({
      title,
      content,
      imgUrl,
      creator: user._id,
    });

    const createdPost = await post.save();
    user.posts?.push(post._id);

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  }
}

export default postResolver;
