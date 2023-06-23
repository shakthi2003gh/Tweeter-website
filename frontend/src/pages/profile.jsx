import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser, toggleFollow } from "../services/http";
import Post from "../layouts/post";
import UserImage from "../components/userImage";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const user_id = useSelector((state) => state.user._id);
  const allPosts = useSelector((state) => state.posts.explore);

  const isFollowing = user?.followers.user_ids.includes(user_id);

  useEffect(() => {
    handleAsync();
  }, [id, allPosts]);

  const handleAsync = async () => {
    const id = await getUserAsync();
    getUserPost(id);
  };

  const getUserAsync = async () => {
    const user = await getUser(id);
    setUser(user);

    return user._id;
  };

  const getUserPost = (id) => {
    const posts = allPosts.filter((p) => p.user._id === id);

    setPosts(posts);
  };

  const handleToggleFollow = async () => {
    const method = isFollowing ? "unfollow" : "follow";
    await toggleFollow(user._id, method);

    getUserAsync();
  };

  return (
    <div className="profile">
      <div className="details">
        <UserImage path={user?.image} />

        <div className="info">
          <div>
            <div className="name">{user?.name || "username"}</div>

            <div className="socials">
              <div>
                <span className="count">{user?.following.count || 0}</span>{" "}
                following
              </div>
              <div>
                <span className="count">{user?.followers.count || 0}</span>{" "}
                followers
              </div>
            </div>
          </div>

          <div className="bio">
            {user?.bio || "Hey there! I am using Tweeter"}
          </div>
        </div>

        {id === user_id ? (
          <Link to="/profile/edit" className="btn btn-secondary">
            <i className="bi bi-pencil"></i> Edit
          </Link>
        ) : isFollowing ? (
          <button className="btn btn-danger" onClick={handleToggleFollow}>
            <i className="bi bi-person-dash"></i> Unfollow
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleToggleFollow}>
            <i className="bi bi-person-add"></i> Follow
          </button>
        )}
      </div>

      {posts.length ? (
        <div className="posts">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="no-post">No Posts</div>
      )}
    </div>
  );
}

export default Profile;
