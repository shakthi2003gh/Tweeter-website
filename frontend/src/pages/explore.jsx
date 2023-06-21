import { useSelector } from "react-redux";
import Post from "../layouts/post";

function Explore() {
  const posts = useSelector((state) => state.posts.explore);

  return (
    <div className="explore">
      <div className="posts">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Explore;
