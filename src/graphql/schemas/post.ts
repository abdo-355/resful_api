import { ObjectType, Field, ID } from "type-graphql";

import User from "./user";

@ObjectType()
class Post {
  @Field((type) => ID)
  _id!: string;
  @Field()
  title!: string;
  @Field()
  imgUrl!: string;
  @Field()
  content!: string;
  @Field((type) => User)
  creator!: User;
  @Field()
  createdAt!: string;
  @Field()
  updatedAt!: string;
}

export default Post;
