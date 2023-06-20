import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Joi from "joi";
import UserImage from "../components/userImage";
import CanReplyPopup from "../components/canReplyPopup";
import { createPost } from "../services/http";

function PostComposer() {
  const [image, setImage] = useState("");
  const [displayError, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [text, setText] = useState("");
  const [isEveryOneCanReply, setIsEveryOneCanReply] = useState(true);
  const [fileBlob, setFileBlob] = useState(undefined);

  const imageRef = useRef(null);
  const path = useSelector((state) => state.user.image);

  const schema = {
    text: Joi.string().required().min(5).max(400).label("text"),
    isEveryOneCanReply: Joi.boolean(),
  };

  const isDisabled = useMemo(() => {
    const post = { text, isEveryOneCanReply };
    const { error } = Joi.object(schema).validate(post);

    return !!error;
  }, [schema, text, isEveryOneCanReply]);

  const togglePopupMenu = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const handleType = (e) => {
    const { error } = schema.text.validate(e.target.value);
    setError(error?.details[0].message);

    setText(e.target.value);
  };

  const handleEveryoneCanReply = (boolean) => {
    togglePopupMenu();

    setIsEveryOneCanReply(boolean);
  };

  const handleImageInput = (e) => {
    if (e.target.files[0]) setFileBlob(e.target.files[0]);
    else if (fileBlob) setFileBlob(undefined);

    const blob = new Blob([e.target.files[0]], { type: "image/jpeg" });
    const blobURL = e.target.files[0] ? URL.createObjectURL(blob) : undefined;

    setImage(blobURL);
  };

  const handleRemoveImage = () => {
    setImage("");
    setFileBlob(undefined);
    imageRef.current.value = null;
  };

  const handleTweet = async () => {
    const post = { text, image: fileBlob, isEveryOneCanReply };

    setIsLoading(true);
    await createPost(post);
    setIsLoading(false);

    setText("");
    handleRemoveImage();
    setIsEveryOneCanReply(true);
  };

  return (
    <div className="post-composer">
      <div className="header">
        <span>Tweet something</span>

        {displayError && (
          <span className="error text-danger">{displayError}</span>
        )}
      </div>

      <div className="body">
        <UserImage path={path} />

        <textarea
          placeholder="What's happening?"
          value={text}
          onChange={handleType}
        ></textarea>

        {image && (
          <div className="upload-image" onClick={handleRemoveImage}>
            <img src={image} alt="" />

            <i className="bi bi-trash"></i>
          </div>
        )}
      </div>

      <div className="footer">
        <label>
          <i className="bi bi-image"></i>
          <input
            ref={imageRef}
            type="file"
            accept="jpg"
            onChange={handleImageInput}
          />
        </label>

        <button className="btn" onClick={togglePopupMenu}>
          {isEveryOneCanReply ? (
            <i className="bi bi-globe-americas">Everyone can reply</i>
          ) : (
            <i className="bi bi-people-fill">People you follow can reply</i>
          )}
        </button>

        {isPopupOpen && (
          <CanReplyPopup
            isEveryOneCanReply={isEveryOneCanReply}
            onClick={handleEveryoneCanReply}
          />
        )}

        <button
          className="btn btn-primary tweet"
          disabled={isDisabled || isLoading}
          onClick={handleTweet}
        >
          Tweet
        </button>
      </div>
    </div>
  );
}

export default PostComposer;
