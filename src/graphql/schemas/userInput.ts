import { Field, InputType, ID } from "type-graphql";
import { IUser } from "../../models/user";

@InputType()
export class userInput implements Partial<IUser> {
  @Field()
  name!: string;
  @Field()
  email!: string;
  @Field()
  password!: string;
}
