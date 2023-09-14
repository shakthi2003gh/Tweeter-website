import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import movement from "moment";
import UserImage from "../components/userImage";
import CommentInputGroup from "../components/commentInputGroup";
import { toggleLike, toggleSave } from "../services/http";
import Comment from "../components/comment";

function Post({ post }) {
  const { _id: id, image, followers } = useSelector((state) => state.user);

  const user = post.user;
  const content = post.content;

  const postImage = content.image || "";
  const createdAt = movement(post.createdAt).calendar();

  const commentsCount = post.comments.length;
  const likedCount = post.likes.count;
  const savedCount = post.saved.count;

  const [showComments, setShowComments] = useState(false);
  const isLiked = post.likes.user_ids.includes(id);
  const isSaved = post.saved.user_ids.includes(id);

  const canReply = useMemo(() => {
    if (post.isEveryOneCanReply) return true;

    return followers.user_ids.includes(user._id);
  }, [post, followers]);

  const handleToggleShowComment = () => {
    setShowComments((prev) => !prev && !!post.comments.length);
  };

  const handleToggleLike = async () => {
    const method = isLiked ? "unlike" : "like";

    await toggleLike(post._id, method);
  };

  const handleToggleSave = async () => {
    const method = isSaved ? "unsave" : "save";

    await toggleSave(post._id, method);
  };

  return (
    <div className="post">
      {showComments ? (
        <div className="comments">
          <button
            className="btn btn-secondary"
            onClick={handleToggleShowComment}
          >
            back
          </button>

          {post.comments.map((comment) => (
            <Comment key={comment._id} {...comment} />
          ))}
        </div>
      ) : (
        <>
          <div className="header">
            <UserImage path={user.image} />

            <div>
              <Link to={"/profile/" + user._id} className="name">
                {user.name}
              </Link>

              <span className="created-at">{createdAt}</span>
            </div>
          </div>

          <div className="content">
            <div className="text">{content.text}</div>

            {postImage && (
              <div className="image">
                <img src={postImage} alt="" loading="lazy" />
              </div>
            )}
          </div>

          <div className="feedback-stats">
            <span className="comments">{commentsCount} comments</span>

            <span className="likes">{likedCount} liked</span>

            <span className="saved">{savedCount} saved</span>
          </div>

          <div className="feedback-section">
            <button className="btn" onClick={handleToggleShowComment}>
              <i className="bi bi-chat-right"></i>
              <span>comment</span>
            </button>

            <button
              className={"btn" + (isLiked ? " liked" : "")}
              onClick={handleToggleLike}
            >
              <i className="bi bi-heart"></i>
              <span>{isLiked ? "liked" : "like"}</span>
            </button>

            <button
              className={"btn" + (isSaved ? " saved" : "")}
              onClick={handleToggleSave}
            >
              <i className="bi bi-bookmark"></i>
              <span>{isSaved ? "saved" : "save"}</span>
            </button>
          </div>

          {canReply && (
            <div className="comment-composer">
              <UserImage path={image} />

              <CommentInputGroup id={post._id} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Post;
