import { Request, Response } from "express";
import { expect } from "chai";
import Sinon from "sinon";
import jwt from "jsonwebtoken";

import isAuth from "../middleware/isAuth";

describe("auth middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: (headerName: string) => {
        return undefined;
      },
    } as Request;
    const res = {} as Response;

    expect(isAuth.bind(null, req, res, () => {})).to.throw("Not authenticated");
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = {
      get: (headerName: string) => {
        return "somerandomtokenstring";
      },
    } as Request;
    const res = {} as Response;
    expect(isAuth.bind(null, req, res, () => {})).to.throw();
  });

  it("should yield a userId if the token is verified", () => {
    const req = {
      get: (headerName: string) => {
        return "some random string as a token";
      },
    } as Request;
    const res = {} as Response;

    Sinon.stub(jwt, "verify");

    (jwt.verify as Sinon.SinonStub).returns({
      userId: "userId in string form",
    });

    isAuth(req, res, () => {});
    expect(req).to.have.property("userId");
    expect((jwt.verify as Sinon.SinonStub).called).to.be.true;
    (jwt.verify as Sinon.SinonStub).restore();
  });
});
