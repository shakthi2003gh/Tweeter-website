const { validatePost } = require("../../../models/post");

describe("post validator ", () => {
  const post = {
    text: "hello world",
    isEveryOneCanReply: true,
  };

  it("should return post without errors", () => {
    const { error, value } = validatePost(post);

    expect(value).toMatchObject(post);
    expect(error).toBe(undefined);
  });

  describe("should return errors:", () => {
    const errorMessages = [
      '"text" must be a string',
      '"text" is required',
      '"text" length must be at least 5 characters long',
      '"text" length must be less than or equal to 400 characters long',
    ];

    it(errorMessages[0], () => {
      post.text = 4552;

      const { error } = validatePost(post);
      expect(error.details[0].message).toBe(errorMessages[0]);
    });

    it(errorMessages[1], () => {
      post.text = undefined;

      const { error } = validatePost(post);
      expect(error.details[0].message).toBe(errorMessages[1]);
    });

    it(errorMessages[2], () => {
      post.text = "helo";

      const { error } = validatePost(post);
      expect(error.details[0].message).toBe(errorMessages[2]);
    });

    it(errorMessages[3], () => {
      post.text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                   Nam euismod tellus eu eros commodo tristique. Aenean eget
                   sagittis velit. Nunc in tellus quis nisl ultrices eleifend
                   a vel elit. Fusce euismod pellentesque lorem, tempus maximus
                   elit aliquet nec. Mauris feugiat ante quis sodales pretium.
                   Ut sit amet mi elementum.`;

      const { error } = validatePost(post);
      expect(error.details[0].message).toBe(errorMessages[3]);
    });
  });
});
