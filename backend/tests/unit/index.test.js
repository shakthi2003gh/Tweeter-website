require("dotenv").config();

let server;

describe("index.js", () => {
  beforeAll(() => {
    process.env.PORT = "";
    process.env.DB_URL = "invalid-url";
    server = require("../../index");
  });

  afterAll(async () => {
    await server.close();
  });

  it("should run on port 3001 if PORT is falsy", async () => {
    expect(server.address().port).toBe(3001);
  });
});
