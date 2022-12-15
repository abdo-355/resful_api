import { expect } from "chai";
import sinon from "sinon";
import { Request, Response } from "express";

import User from "../models/user";
import * as authController from "../controllers/auth";
import ResponseError from "../utils/responseError";

describe("auth controllers - login", () => {
  it("should throw an error with code 500 if accessing the database fails", async () => {
    sinon.stub(User, "findOne");

    (User.findOne as sinon.SinonStub).throws();

    const req = {
      body: {
        email: "email@test.test",
        password: "12345",
      },
    } as Request;

    const result = authController.login(
      req,
      {} as Response,
      () => {}
    ) as unknown as Promise<ResponseError>;

    const data = await result;

    expect(data).to.be.an("error");
    expect(data).to.have.property("statusCode", 500);

    (User.findOne as sinon.SinonStub).restore();
  });
});
