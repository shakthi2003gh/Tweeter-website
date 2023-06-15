require("dotenv").config();

const request = require("supertest");
const { User } = require("../../../models/user");
let server;

const usersPath = "/api/users";
describe(usersPath, () => {
  let id,
    token = "",
    userRes;
  let payload = {
    name: "shakthi",
    email: "shakthi@domain.com",
    password: "shakthi",
  };

  beforeAll(async () => {
    server = require("../../../index");
    userRes = await request(server)
      .post(usersPath)
      .set("x-auth-token", token)
      .send(payload);
  }, 10000);

  afterAll(async () => {
    await server.close();
    await User.deleteMany();
  });

  beforeEach(() => {
    id = userRes.body._id;
    token = userRes.header["x-tweeter-auth"];
  });

  describe("GET /me", () => {
    it("should return signed-in user", async () => {
      const res = await request(server)
        .get(usersPath + "/me")
        .set("x-tweeter-auth", token);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(payload.name);
    });
  });

  describe("GET /:id", () => {
    const exec = () => {
      return request(server)
        .get(usersPath + "/" + id)
        .set("x-tweeter-auth", token);
    };

    it("should return 404 if user does not exist", async () => {
      id = "123456789012";
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toBe("User not found.");
    });

    it("should return user", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(payload.name);
    });
  });

  describe("POST /", () => {
    let payload;
    const exec = () => {
      return request(server).post(usersPath).send(payload);
    };

    beforeEach(() => {
      payload = {
        name: "shakthi",
        email: "shakhti2@domain.com",
        password: "shakthi",
      };
    });

    afterEach(async () => {
      await User.findOneAndDelete({ email: payload.email });
    });

    it("should return 400 if payload is invalid", async () => {
      payload.email = "shakthi";

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.text).toBe('"email" must be a valid email');
    });

    it("should return 409 if email id already taken", async () => {
      await exec();
      const res = await exec();

      expect(res.status).toBe(409);
      expect(res.text).toBe("User with email already exists.");
    });

    it("password should be encrypted", async () => {
      const res = await exec();
      const user = await User.findById(res.body._id);

      expect(res.status).toBe(200);
      expect(user.password).not.toEqual(payload.password);
    });

    it("should saved and return user", async () => {
      const res = await exec();
      const user = await User.findById(res.body._id);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(user.id);
      expect(res.header["x-tweeter-auth"]).not.toBe(null);
    });
  });

  describe("POST /:id/follow", () => {
    let user2Res;
    const exec = () => {
      return request(server)
        .post(`${usersPath}/${id}/follow`)
        .set("x-tweeter-auth", token);
    };

    beforeAll(async () => {
      user2Res = await request(server).post(usersPath).send({
        name: "shakthi",
        email: "shakhti3@domain.com",
        password: "shakthi",
      });
    });

    afterAll(async () => {
      await User.findByIdAndDelete(user2Res.body._id);
    });

    beforeEach(async () => {
      token = user2Res.header["x-tweeter-auth"];
      await request(server)
        .post(`${usersPath}/${id}/unfollow`)
        .set("x-tweeter-auth", token);
    });

    it("should return 400 if user try to follow themself", async () => {
      id = user2Res.body._id;
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.text).toBe("User cannot follow themself.");
    });

    it("should return 404 if user does not exist", async () => {
      id = "536456456454";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.text).toBe("User not found.");
    });

    it("should return 409 if user already following the user", async () => {
      await exec();
      const res = await exec();

      expect(res.status).toBe(409);
      expect(res.text).toBe("User already following user with given id.");
    });

    it("should return 204 if user follow", async () => {
      const res = await exec();
      const user = await User.findById(user2Res.body._id);
      const followingUser = await User.findById(id);

      expect(res.status).toBe(204);
      expect(user.following.user_ids).toContainEqual(followingUser._id);
      expect(followingUser.followers.user_ids).toContainEqual(user._id);
    });
  });

  describe("POST /:id/unfollow", () => {
    let user2Res;
    const exec = () => {
      return request(server)
        .post(`${usersPath}/${id}/unfollow`)
        .set("x-tweeter-auth", token);
    };

    beforeAll(async () => {
      user2Res = await request(server).post(usersPath).send({
        name: "shakthi",
        email: "shakhti3@domain.com",
        password: "shakthi",
      });
    });

    afterAll(async () => {
      await User.findByIdAndDelete(user2Res.body._id);
    });

    beforeEach(async () => {
      token = user2Res.header["x-tweeter-auth"];
      await request(server)
        .post(`${usersPath}/${id}/follow`)
        .set("x-tweeter-auth", token);
    });

    it("should return 400 if user try to unfollow themself", async () => {
      id = user2Res.body._id;
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.text).toBe("User cannot unfollow themself.");
    });

    it("should return 404 if user does not exist", async () => {
      id = "536456456454";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.text).toBe("User not found.");
    });

    it("should return 409 if user not following the user", async () => {
      await exec();
      const res = await exec();

      expect(res.status).toBe(409);
      expect(res.text).toBe("User not following user with given id.");
    });

    it("should return 204, if user unfollow", async () => {
      const res = await exec();
      const user = await User.findById(user2Res.body._id);
      const followingUser = await User.findById(id);

      expect(res.status).toBe(204);
      expect(user.following.user_ids).not.toContainEqual(followingUser._id);
      expect(followingUser.followers.user_ids).not.toContainEqual(user._id);
    });
  });

  describe("PATCH /", () => {
    let name = "shakhti kumar";
    let profileImage = process.env.testImage;

    const exec = () => {
      return request(server)
        .patch(usersPath)
        .set("x-tweeter-auth", token)
        .attach("profile", profileImage)
        .field("name", name);
    };

    beforeEach(() => {
      name = "shakthi";
      profileImage = process.env.testImage;
    });

    it("should return 400 if payload is invalid", async () => {
      name = "sh";
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe('"name" length must be at least 3 characters long');
    });

    it("user image should be undefined if image not in payload", async () => {
      profileImage = "";
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(name);
    });

    it("should return updated user", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(name);
    });
  });

  describe("DELETE /me", () => {
    const exec = () => {
      return request(server)
        .delete(usersPath + "/me")
        .set("x-tweeter-auth", token);
    };

    beforeAll(async () => {
      await request(server)
        .post("/api/posts")
        .set("x-tweeter-auth", token)
        .send({ text: "hello" });
    });

    it("should return 200", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.text).toBe("User successfully deleted.");
    });
  });
});
