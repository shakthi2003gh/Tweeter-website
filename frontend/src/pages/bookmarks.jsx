import { useSelector } from "react-redux";
import Post from "../layouts/post";

function Bookmarks() {
  const posts = useSelector((state) => state.posts.saved);

  return (
    <div className="bookmarks">
      <div className="posts">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Bookmarks;
