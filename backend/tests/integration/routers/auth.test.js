require("dotenv").config();

const request = require("supertest");
const { User } = require("../../../models/user");
let server;

const authPath = "/api/auth";
describe(authPath, () => {
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
    await User.deleteMany();
  });

  describe("POST /", () => {
    let user;
    const payload = {
      name: "shakthi",
      email: "shakthi@domain.com",
      password: "shakthi",
    };
    let email = payload.email;
    let password = payload.password;

    const exec = () => {
      return request(server).post(authPath).send({ email, password });
    };

    beforeEach(async () => {
      user = await request(server).post("/api/users").send(payload);

      email = payload.email;
      password = payload.password;
    });

    it("should return 400 if signin validator find errors", async () => {
      email = "shakthi";

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.text).toBe('"email" must be a valid email');
    });

    it("should return 400 if invalid email", async () => {
      email = "shakthi1@domain.com";

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email or password");
    });

    it("should return 400 if invalid password", async () => {
      password = "shakthi1";

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email or password");
    });

    it("should set token response header if valid", async () => {
      const res = await exec();
      const token = res.header["x-tweeter-auth"];
      expect(res.status).toBe(200);
      expect(res.header).toHaveProperty("x-tweeter-auth", token);
    });

    it("should return user if valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(user.body);
    });
  });
});
