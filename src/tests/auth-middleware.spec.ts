import { Request, Response } from "express";
import { expect } from "chai";

import isAuth from "../middleware/isAuth";

it("should throw an error if no authorization header is present", () => {
  const req = {
    get: (headerName: string) => {
      return undefined;
    },
  } as Request;
  const res = {} as Response;

  expect(isAuth.bind(null, req, res, () => {})).to.throw("Not authenticated");
});
