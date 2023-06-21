import { useSelector } from "react-redux";
import PostComposer from "../layouts/postComposer";
import Post from "../layouts/post";

function Home() {
  const posts = useSelector((state) => state.posts.home);

  return (
    <div className="home">
      <PostComposer />

      <div className="posts">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;
