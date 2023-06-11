require("dotenv").config();

const jwt = require("jsonwebtoken");
const { auth } = require("../../../middleware/auth");
const { User } = require("../../../models/user");

describe("auth middleware", () => {
  const user = {
    name: "shakthi",
    image: "shakhti/image",
  };
  user._id = new User()._id;

  let token = jwt.sign(user, process.env.JWK);
  let req = { header: jest.fn().mockReturnValue(token) };
  let res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
  let next = jest.fn();

  beforeEach(() => {
    req.user = user;
    res.status = jest.fn().mockReturnValue({ send: jest.fn() });
    req.next = jest.fn();
  });

  it("should return 401 if token is not provider", () => {
    req.header = jest.fn().mockReturnValue(undefined);

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.status(401).send).toHaveBeenCalled();
  });

  it("should return 400 if invalid token is passed", () => {
    let token = jwt.sign(user, "Invalidkey");
    req.header = jest.fn().mockReturnValue(token);

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status(400).send).toHaveBeenCalled();
  });
});
