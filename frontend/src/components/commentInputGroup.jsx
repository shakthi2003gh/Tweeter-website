const CommentInputGroup = () => {
  return (
    <div className="comment-input-group">
      <input type="text" placeholder="Tweet your reply" />

      <button className="btn btn-primary">
        <i className="bi bi-send"></i>
      </button>
    </div>
  );
};

export default CommentInputGroup;
