require("dotenv").config();

const request = require("supertest");
const { User } = require("../../../models/user");
const { Post } = require("../../../models/post");
const { default: mongoose } = require("mongoose");
let server;

const postsPath = "/api/posts";
describe(postsPath, () => {
  let id, userResponse, token, posts;
  const userPayload = {
    name: "shakthi",
    email: "shakthi@domain.com",
    password: "shakthi",
  };

  beforeAll(async () => {
    server = require("../../../index");
    userResponse = await request(server).post("/api/users").send(userPayload);
    posts = await createPosts();
  }, 10000);

  afterAll(async () => {
    posts = [];
    await server.close();
    await User.deleteMany();
    await Post.deleteMany();
  });

  beforeEach(() => {
    id = posts[0]._id;
    token = userResponse.header["x-tweeter-auth"];
  });

  function createPosts() {
    const posts = [];
    const payloads = [
      {
        text: "hello world",
      },
      {
        text: "Another post",
      },
      {
        text: "new post",
      },
    ];

    payloads.forEach((payload) => {
      posts.push(
        new Promise(async (resolve, reject) => {
          try {
            const res = await request(server)
              .post("/api/posts")
              .set("x-tweeter-auth", userResponse.header["x-tweeter-auth"])
              .send(payload);

            resolve(res.body);
          } catch (error) {
            reject(error);
          }
        })
      );
    });

    return Promise.all(posts);
  }

  describe("GET /", () => {
    it("should return all posts", async () => {
      const res = await request(server).get(postsPath);

      expect(res.status).toBe(200);
      expect(res.body).not.toBe(null);
    });
  });

  describe("GET /:id", () => {
    const exec = () => {
      return request(server).get(postsPath + "/" + id);
    };

    it("should return 400 if id is invalid", async () => {
      id = 25454;
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid id.");
    });

    it("should return 404 if post does not exist", async () => {
      id = userResponse.body._id;
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toBe("Post not found.");
    });

    it("should return a post", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).not.toBe(null);
    });
  });

  describe("GET /:id/comments", () => {
    const exce = () => {
      return request(server).get(`${postsPath}/${id}/comments`);
    };

    it("should return 404 if post does not exist", async () => {
      id = userResponse.body._id;
      const res = await exce();

      expect(res.status).toBe(404);
      expect(res.text).toBe("Post not found.");
    });

    it("should return post comments", async () => {
      const res = await exce();

      expect(res.status).toBe(200);
      expect(res.body).not.toBe(null);
    });
  });

  describe("POST /", () => {
    let image;
    let text = "hello everyone";
    const exec = () => {
      return request(server)
        .post(postsPath)
        .set("x-tweeter-auth", token)
        .attach("image", image)
        .field("text", text);
    };

    beforeEach(() => {
      image = process.env.testImage;
    });

    afterEach(() => {
      text = "hello everyone";
      image = undefined;
    });

    it("should return 401 if token is invalid", async () => {
      token = new User({
        name: "fake",
        image: "image/fake",
      }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(401);
      expect(res.text).toBe("Access denied. Invalid token");
    });

    it("should return 400 if payload is invalid", async () => {
      text = "asd";
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe('"text" length must be at least 5 characters long');
    });

    it("should save and return post", async () => {
      const res = await exec();
      const post = await Post.findById(res.body._id);

      expect(res.status).toBe(200);
      expect(res.body).not.toBe(null);
      expect(post.content.text).toBe(text);
    });
  });

  describe("POST /:id/comment", () => {
    let message;
    const exec = () => {
      return request(server)
        .post(`${postsPath}/${id}/comment`)
        .set("x-tweeter-auth", token)
        .send({ message });
    };

    beforeEach(() => {
      message = "good morning";
    });

    it("should return 404 if post does not exist", async () => {
      id = userResponse.body._id;
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toBe("Post not found.");
    });

    it("should return 400 if payload is invalid", async () => {
      message = "helo";
      const res = await exec();

      const error = '"message" length must be at least 5 characters long';
      expect(res.status).toBe(400);
      expect(res.text).toBe(error);
    });

    it("should save and return comment", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.post_id).toBe(id);
      expect(res.body.comment.message).toBe(message);
    });
  });

  describe("POST /:id/like", () => {
    let token2, user2Response;
    const user2Payload = {
      name: "shakthi",
      email: "shakthi2@domain.com",
      password: "shakthi",
    };

    const exec = () => {
      return request(server)
        .post(`${postsPath}/${id}/like`)
        .set("x-tweeter-auth", token2);
    };

    beforeAll(async () => {
      user2Response = await request(server)
        .post("/api/users")
        .send(user2Payload);
    });

    afterAll(async () => {
      await User.findByIdAndDelete(user2Response.body._id);
    });

    beforeEach(() => {
      token2 = user2Response.header["x-tweeter-auth"];
    });

    afterEach(async () => {
      await request(server)
        .post(`${postsPath}/${id}/unlike`)
        .set("x-tweeter-auth", token2);
    });

    it("should return 404 if post does not exist", async () => {
      id = user2Response.body._id;
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toBe("Post not found.");
    });

    it("should return 403 if user try to like their own post", async () => {
      token2 = token;
      const res = await exec();

      expect(res.status).toBe(403);
      expect(res.text).toBe("User cannot like their own post");
    });

    it("should return 409 if user already liked the post", async () => {
      await exec();
      const res = await exec();

      expect(res.status).toBe(409);
      expect(res.text).toBe("User already liked this post.");
    });

    it("should return 204", async () => {
      const res = await exec();
      const post = await Post.findById(id);
      const userId = new mongoose.Types.ObjectId(user2Response.body._id);

      expect(res.status).toBe(204);
      expect(res.body).toMatchObject({});
      expect(post.likes.user_ids).toContainEqual(userId);
    });
  });

  describe("POST /:id/unlike", () => {
    let token2, user2Response;
    const user2Payload = {
      name: "shakthi",
      email: "shakthi2@domain.com",
      password: "shakthi",
    };

    const exec = () => {
      return request(server)
        .post(`${postsPath}/${id}/unlike`)
        .set("x-tweeter-auth", token2);
    };

    beforeAll(async () => {
      user2Response = await request(server)
        .post("/api/users")
        .send(user2Payload);
    });

    afterAll(async () => {
      await User.findByIdAndDelete(user2Response.body._id);
    });

    beforeEach(() => {
      token2 = user2Response.header["x-tweeter-auth"];
    });

    afterEach(async () => {
      await request(server)
        .post(`${postsPath}/${id}/like`)
        .set("x-tweeter-auth", token2);
    });

    it("should return 404 if post does not exist", async () => {
      id = user2Response.body._id;
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toBe("Post not found.");
    });

    it("should return 403 if user try to unlike their own post", async () => {
      token2 = token;
      const res = await exec();

      expect(res.status).toBe(403);
      expect(res.text).toBe("User cannot unlike their own post");
    });

    it("should return 409 if user not liked the post", async () => {
      await exec();
      const res = await exec();

      expect(res.status).toBe(409);
      expect(res.text).toBe("User not liked this post.");
    });

    it("should return 204", async () => {
      const res = await exec();
      const post = await Post.findById(id);
      const userId = new mongoose.Types.ObjectId(user2Response.body._id);

      expect(res.status).toBe(204);
      expect(res.body).toMatchObject({});
      expect(post.likes.user_ids).not.toContainEqual(userId);
    });
  });

  describe("POST /:id/save", () => {
    let token2, user2Response;
    const user2Payload = {
      name: "shakthi",
      email: "shakthi2@domain.com",
      password: "shakthi",
    };

    const exec = () => {
      return request(server)
        .post(`${postsPath}/${id}/save`)
        .set("x-tweeter-auth", token2);
    };

    beforeAll(async () => {
      user2Response = await request(server)
        .post("/api/users")
        .send(user2Payload);
    });

    afterAll(async () => {
      await User.findByIdAndDelete(user2Response.body._id);
    });

    beforeEach(() => {
      token2 = user2Response.header["x-tweeter-auth"];
    });

    afterEach(async () => {
      await request(server)
        .post(`${postsPath}/${id}/unsave`)
        .set("x-tweeter-auth", token2);
    });

    it("should return 404 if post does not exist", async () => {
      id = user2Response.body._id;
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toBe("Post not found.");
    });

    it("should return 403 if user try to save their own post", async () => {
      token2 = token;
      const res = await exec();

      expect(res.status).toBe(403);
      expect(res.text).toBe("User cannot save their own post");
    });

    it("should return 409 if user already saved the post", async () => {
      await exec();
      const res = await exec();

      expect(res.status).toBe(409);
      expect(res.text).toBe("User already saved this post.");
    });

    it("should return 204", async () => {
      const res = await exec();
      const user = await User.findById(user2Response.body._id);
      const post = await Post.findById(id);
      const userId = new mongoose.Types.ObjectId(user2Response.body._id);
      const postId = new mongoose.Types.ObjectId(id);

      expect(res.status).toBe(204);
      expect(res.body).toMatchObject({});
      expect(user.saved_post_ids).toContainEqual(postId);
      expect(post.saved.user_ids).toContainEqual(userId);
    });
  });

  describe("POST /:id/unsave", () => {
    let token2, user2Response;
    const user2Payload = {
      name: "shakthi",
      email: "shakthi2@domain.com",
      password: "shakthi",
    };

    const exec = () => {
      return request(server)
        .post(`${postsPath}/${id}/unsave`)
        .set("x-tweeter-auth", token2);
    };

    beforeAll(async () => {
      user2Response = await request(server)
        .post("/api/users")
        .send(user2Payload);
    });

    afterAll(async () => {
      await User.findByIdAndDelete(user2Response.body._id);
    });

    beforeEach(() => {
      token2 = user2Response.header["x-tweeter-auth"];
    });

    afterEach(async () => {
      await request(server)
        .post(`${postsPath}/${id}/save`)
        .set("x-tweeter-auth", token2);
    });

    it("should return 404 if post does not exist", async () => {
      id = user2Response.body._id;
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toBe("Post not found.");
    });

    it("should return 403 if user try to unsave their own post", async () => {
      token2 = token;
      const res = await exec();

      expect(res.status).toBe(403);
      expect(res.text).toBe("User cannot unsave their own post");
    });

    it("should return 409 if user not saved the post", async () => {
      await exec();
      const res = await exec();

      expect(res.status).toBe(409);
      expect(res.text).toBe("User not saved this post.");
    });

    it("should return 204", async () => {
      const res = await exec();
      const user = await User.findById(user2Response.body._id);
      const post = await Post.findById(id);
      const userId = new mongoose.Types.ObjectId(user2Response.body._id);
      const postId = new mongoose.Types.ObjectId(id);

      expect(res.status).toBe(204);
      expect(res.body).toMatchObject({});
      expect(user.saved_post_ids).not.toContainEqual(postId);
      expect(post.saved.user_ids).not.toContainEqual(userId);
    });
  });

  describe("DELETE /:id", () => {
    let token2, user2Response;
    const user2Payload = {
      name: "shakthi",
      email: "shakthi2@domain.com",
      password: "shakthi",
    };

    const exec = () => {
      return request(server)
        .delete(postsPath + "/" + id)
        .set("x-tweeter-auth", token);
    };

    beforeAll(async () => {
      user2Response = await request(server)
        .post("/api/users")
        .send(user2Payload);
    });

    afterAll(async () => {
      await User.findByIdAndDelete(user2Response.body._id);
    });

    beforeEach(() => {
      token2 = user2Response.header["x-tweeter-auth"];
    });

    afterEach(async () => {
      await Post.deleteMany();
      posts = await createPosts();
    });

    it("should return 404 if post does not exist", async () => {
      id = userResponse.body._id;
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toBe("Post with given id does not exist.");
    });

    it("should return 403 if user try to delete some one post", async () => {
      token = token2;
      const res = await exec();

      expect(res.status).toBe(403);
      expect(res.text).toBe("User do not have permission to delete this post.");
    });

    it("should return delete post", async () => {
      const res = await exec();
      const user = await User.findById(userResponse.body._id);
      const postId = new mongoose.Types.ObjectId(id);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(id);
      expect(user.post_ids).not.toContainEqual(postId);
    });
  });
});
