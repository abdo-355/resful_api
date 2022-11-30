import { ObjectType, Field, ID } from "type-graphql";
import Post from "./post";

@ObjectType()
class User {
  @Field((type) => ID)
  _id!: string;
  @Field()
  name!: string;
  @Field()
  email!: string;
  @Field()
  password!: string;
  @Field()
  status!: string;
  @Field((type) => [Post])
  posts!: Post[];
  @Field()
  createdAt!: string;
  @Field()
  updatedAt!: string;
}

export default User;
