require("dotenv").config();

const jwt = require("jsonwebtoken");
const {
  User,
  validateSignup,
  validateSignin,
  validateUpdateUser,
} = require("../../../models/user");

describe("user.generateAuthToken", () => {
  it("should return a valid jsonwebtoken", () => {
    const _id = "648523820cecedf3c16f1502";
    const payload = { _id, name: "shakthi", image: "shakthi/image" };

    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.JWK);

    expect(decoded).toMatchObject(payload);
  });
});

describe("user validators", () => {
  describe("user signup validator", () => {
    const user = {
      name: "shakthi",
      email: "shakthi@domain.com",
      password: "shakthi",
    };

    beforeEach(() => {
      user.name = "shakthi";
      user.email = "shakthi@domain.com";
      user.password = "shakthi";
    });

    it("should return post without errors", () => {
      const { error, value } = validateSignup(user);

      expect(value).toMatchObject(user);
      expect(error).toBe(undefined);
    });

    describe("should return errors:", () => {
      const errorMessages = [
        '"name" must be a string',
        '"name" is required',
        '"name" length must be at least 3 characters long',
        '"name" length must be less than or equal to 50 characters long',
        '"email" must be a string',
        '"email" is required',
        '"email" must be a valid email',
        '"email" length must be less than or equal to 50 characters long',
        '"password" must be a string',
        '"password" is required',
        '"password" length must be at least 5 characters long',
        '"password" length must be less than or equal to 50 characters long',
      ];

      it(errorMessages[0], () => {
        user.name = 4552;

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[0]);
      });

      it(errorMessages[1], () => {
        user.name = undefined;

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[1]);
      });

      it(errorMessages[2], () => {
        user.name = "sh";

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[2]);
      });

      it(errorMessages[3], () => {
        user.name = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[3]);
      });

      it(errorMessages[4], () => {
        user.email = 4552;

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[4]);
      });

      it(errorMessages[5], () => {
        user.email = undefined;

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[5]);
      });

      it(errorMessages[6], () => {
        user.email = "shakthiatdomaindotcom";

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[6]);
      });

      it(errorMessages[7], () => {
        user.email = `shakthikumar123456789thisislongmail@googledomain.com`;

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[7]);
      });

      it(errorMessages[8], () => {
        user.password = 4552;

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[8]);
      });

      it(errorMessages[9], () => {
        user.password = undefined;

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[9]);
      });

      it(errorMessages[10], () => {
        user.password = "sh";

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[10]);
      });

      it(errorMessages[11], () => {
        user.password = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;

        const { error } = validateSignup(user);
        expect(error.details[0].message).toBe(errorMessages[11]);
      });
    });
  });

  describe("user signin validator", () => {
    const user = {
      email: "shakthi@domain.com",
      password: "shakthi",
    };

    beforeEach(() => {
      user.email = "shakthi@domain.com";
      user.password = "shakthi";
    });

    it("should return post without errors", () => {
      const { error, value } = validateSignin(user);

      expect(value).toMatchObject(user);
      expect(error).toBe(undefined);
    });

    describe("should return errors:", () => {
      const errorMessages = [
        '"email" must be a string',
        '"email" is required',
        '"email" must be a valid email',
        '"email" length must be less than or equal to 50 characters long',
        '"password" must be a string',
        '"password" is required',
        '"password" length must be at least 5 characters long',
        '"password" length must be less than or equal to 50 characters long',
      ];

      it(errorMessages[0], () => {
        user.email = 4552;

        const { error } = validateSignin(user);
        expect(error.details[0].message).toBe(errorMessages[0]);
      });

      it(errorMessages[1], () => {
        user.email = undefined;

        const { error } = validateSignin(user);
        expect(error.details[0].message).toBe(errorMessages[1]);
      });

      it(errorMessages[2], () => {
        user.email = "shakthiatdomaindotcom";

        const { error } = validateSignin(user);
        expect(error.details[0].message).toBe(errorMessages[2]);
      });

      it(errorMessages[3], () => {
        user.email = `shakthikumar123456789thisislongmail@googledomain.com`;

        const { error } = validateSignin(user);
        expect(error.details[0].message).toBe(errorMessages[3]);
      });

      it(errorMessages[4], () => {
        user.password = 4552;

        const { error } = validateSignin(user);
        expect(error.details[0].message).toBe(errorMessages[4]);
      });

      it(errorMessages[5], () => {
        user.password = undefined;

        const { error } = validateSignin(user);
        expect(error.details[0].message).toBe(errorMessages[5]);
      });

      it(errorMessages[6], () => {
        user.password = "sh";

        const { error } = validateSignin(user);
        expect(error.details[0].message).toBe(errorMessages[6]);
      });

      it(errorMessages[7], () => {
        user.password = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;

        const { error } = validateSignin(user);
        expect(error.details[0].message).toBe(errorMessages[7]);
      });
    });
  });

  describe("user update validator", () => {
    const user = {
      name: "shakthi",
      bio: "welcome everyone!",
    };

    beforeEach(() => {
      user.name = "shakthi";
      user.bio = "welcome everyone!";
    });

    it("should return post without errors", () => {
      const { error, value } = validateUpdateUser(user);

      expect(value).toMatchObject(user);
      expect(error).toBe(undefined);
    });

    describe("should return errors:", () => {
      const errorMessages = [
        '"name" must be a string',
        '"name" length must be at least 3 characters long',
        '"name" length must be less than or equal to 50 characters long',
        '"bio" must be a string',
        '"bio" length must be at least 5 characters long',
        '"bio" length must be less than or equal to 150 characters long',
      ];

      it(errorMessages[0], () => {
        user.name = 4552;

        const { error } = validateUpdateUser(user);
        expect(error.details[0].message).toBe(errorMessages[0]);
      });

      it(errorMessages[1], () => {
        user.name = "sh";

        const { error } = validateUpdateUser(user);
        expect(error.details[0].message).toBe(errorMessages[1]);
      });

      it(errorMessages[2], () => {
        user.name = `shakthikumar123456789thisislongmailatgoogledomain.com`;

        const { error } = validateUpdateUser(user);
        expect(error.details[0].message).toBe(errorMessages[2]);
      });

      it(errorMessages[3], () => {
        user.bio = 4552;

        const { error } = validateUpdateUser(user);
        expect(error.details[0].message).toBe(errorMessages[3]);
      });

      it(errorMessages[4], () => {
        user.bio = "sh";

        const { error } = validateUpdateUser(user);
        expect(error.details[0].message).toBe(errorMessages[4]);
      });

      it(errorMessages[5], () => {
        user.bio = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed porta purus sem, ac blandit risus fermentum id. 
                    In sollicitudin eget lacus vitae gravida.`;

        const { error } = validateUpdateUser(user);
        expect(error.details[0].message).toBe(errorMessages[5]);
      });
    });
  });
});
