import { Link } from "react-router-dom";
import movement from "moment";
import UserImage from "./userImage";

function Comment({ user, message, createdAt }) {
  const created_at = movement(createdAt).calendar();

  return (
    <div className="comment">
      <UserImage path={user.image} />

      <div className="content">
        <div className="header">
          <Link to={"/profile/" + user._id} className="name">
            {user.name}
          </Link>
          <div className="createAt">{created_at}</div>
        </div>

        <div className="message">{message}</div>
      </div>
    </div>
  );
}

export default Comment;
