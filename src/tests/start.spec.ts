import { expect } from "chai";

it("should add two numbers", () => {
  const num1 = 4;
  const num2 = 5;
  expect(num1 + num2).to.equal(9);
});

it("should not give the result of 10", () => {
  const num1 = 4;
  const num2 = 5;
  expect(num1 + num2).not.to.equal(10);
});

it("message", () => {
  const str1 = "4";
  const str2 = "5";
  expect(str1 + str2).to.equal("45");
});
