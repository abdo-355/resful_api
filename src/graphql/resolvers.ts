import { Resolver, Query } from "type-graphql";
import "reflect-metadata";
import { test } from "./schema";

@Resolver(test)
export class testResolver {
  @Query(() => test)
  async hello() {
    return {
      text: "hello world",
      num: 34534,
    };
  }
}
