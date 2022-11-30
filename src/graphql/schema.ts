import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class test {
  @Field()
  text!: string;
  @Field()
  num!: number;
}
