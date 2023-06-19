import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Joi from "joi";
import CanReplyPopup from "../components/canReplyPopup";
import { createPost } from "../services/http";

function PostComposer() {
  const [image, setImage] = useState("");
  const [displayError, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [text, setText] = useState("");
  const [isEveryOneCanReply, setIsEveryOneCanReply] = useState(true);
  const [fileBlob, setFileBlob] = useState(undefined);

  const imageRef = useRef(null);
  const userImagePath = useSelector((state) => state.user.image);
  const path = import.meta.env.VITE_API_ENDPOINT + "/" + userImagePath;

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

    await createPost(post);

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
        {userImagePath ? (
          <img src={path} alt="" />
        ) : (
          <i className="bi bi-person-circle"></i>
        )}

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
          disabled={isDisabled}
          onClick={handleTweet}
        >
          Tweet
        </button>
      </div>
    </div>
  );
}

export default PostComposer;
