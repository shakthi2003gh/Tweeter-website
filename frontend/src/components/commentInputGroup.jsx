import { useMemo, useState } from "react";
import Joi from "joi";
import { postComment } from "../services/http";

const CommentInputGroup = ({ id }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isDisplay = useMemo(() => {
    const { error } = Joi.object({
      message: Joi.string().required().min(5).max(200),
    }).validate({ message });

    return !!error;
  }, [message]);

  const handleType = (e) => {
    setMessage(e.target.value);
  };

  const handleComment = () => {
    setIsLoading(true);

    postComment(id, message).then(() => {
      setMessage("");
      setIsLoading(false);
    });
  };

  return (
    <div className="comment-input-group">
      <input
        type="text"
        placeholder="Tweet your reply"
        value={message}
        onChange={handleType}
      />

      <button
        className="btn btn-primary"
        onClick={handleComment}
        disabled={isDisplay || isLoading}
      >
        <i className="bi bi-send"></i>
      </button>
    </div>
  );
};

export default CommentInputGroup;
