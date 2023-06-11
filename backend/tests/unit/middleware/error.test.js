const { error } = require("../../../middleware/error");

describe("error middleware", () => {
  let err = "Error message...";
  let req = {};
  let res = {
    status: jest
      .fn()
      .mockReturnValue({ send: jest.fn().mockReturnValue({ error: err }) }),
  };
  let next = jest.fn();

  it("should return error with statusCode 500", () => {
    error(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status(500).send).toHaveBeenCalled();
  });
});
