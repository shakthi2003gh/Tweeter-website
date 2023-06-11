const { User } = require("../../../models/user");
const { validateObjectId } = require("../../../middleware/validateObjectId");

describe("validateObjectId middleware", () => {
  const user = {
    name: "shakthi",
    email: "shakthi@domain.com",
    password: "shakthi",
  };

  let req = { params: { id: new User(user)._id } };
  let res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
  let next = jest.fn();

  beforeEach(() => {
    req = { params: { id: new User(user)._id } };
    res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
    next = jest.fn();
  });

  it("should not return errors if valid id is passed", () => {
    validateObjectId(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return error if invalid id is passed", () => {
    req.params.id = "1";

    validateObjectId(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status(400).send).toHaveBeenCalledWith("Invalid id.");
  });
});
