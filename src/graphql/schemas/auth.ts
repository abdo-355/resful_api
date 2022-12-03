import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class authData {
  @Field()
  token!: string;
  @Field()
  userId!: string;
}
