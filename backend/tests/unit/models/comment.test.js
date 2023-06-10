const { validateComment } = require("../../../models/comment");

describe("comment validator", () => {
  const comment = {
    message: "Hello world",
  };

  it("should return comment without errors", () => {
    const { error, value } = validateComment(comment);

    expect(value).toMatchObject(comment);
    expect(error).toBe(undefined);
  });

  describe("should return errors:", () => {
    const errorMessages = [
      '"message" must be a string',
      '"message" is required',
      '"message" length must be at least 5 characters long',
      '"message" length must be less than or equal to 200 characters long',
    ];

    it(errorMessages[0], () => {
      comment.message = 4552;

      const { error } = validateComment(comment);
      expect(error.details[0].message).toBe(errorMessages[0]);
    });

    it(errorMessages[1], () => {
      comment.message = undefined;

      const { error } = validateComment(comment);
      expect(error.details[0].message).toBe(errorMessages[1]);
    });

    it(errorMessages[2], () => {
      comment.message = "helo";

      const { error } = validateComment(comment);
      expect(error.details[0].message).toBe(errorMessages[2]);
    });

    it(errorMessages[3], () => {
      comment.message = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                         Duis interdum leo ante, finibus mattis mi hendrerit vitae.
                         In nec nisi sodales, pharetra felis eget, varius nisi.`;

      const { error } = validateComment(comment);
      expect(error.details[0].message).toBe(errorMessages[3]);
    });
  });
});
