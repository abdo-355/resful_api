import { Resolver, Query, Mutation, Arg } from "type-graphql";
import "reflect-metadata";

@Resolver()
class testResolver {
  @Query(() => String)
  async hello() {
    return "hello world";
  }
}

export default testResolver;
