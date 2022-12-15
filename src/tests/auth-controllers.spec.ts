import { expect } from "chai";
import sinon from "sinon";
import { Request, Response } from "express";
import mongoose from "mongoose";

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

describe("auth controllers - status", () => {
  it("should send a response with a valid user status for an existing user", async () => {
    // for deprication error
    mongoose.set("strictQuery", true);
    // ------------------------
    await mongoose.connect(process.env.MONGO_TESTING_URI!);

    const user = new User({
      _id: "5c0f66b979af55031b34728a",
      name: "tester",
      email: "tester@testing.com",
      password: "1235testing",
    });

    await user.save();

    const req = {
      userId: "5c0f66b979af55031b34728a",
    } as Request;

    const res = {
      statusCode: 500,
      userStatus: "",
      status: function (status: number) {
        this.statusCode = status;
        // in order to call json() after status
        return this;
      },
      json: function (data: { status: string }) {
        this.userStatus = data.status;
      },
    } as any;

    await (authController.getUserStatus(
      req,
      res,
      () => {}
    ) as unknown as Promise<any>);

    expect(res.statusCode).to.equal(200);
    expect(res.userStatus).to.equal("I am new!");

    // delete the created user and close th db connection after finishing the test
    await User.deleteMany({});
    await mongoose.disconnect();
    //---------------------------------------------------
  });
});
