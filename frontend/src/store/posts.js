import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    home: [],
    explore: [],
    saved: [],
  },
  reducers: {
    add: (state, action) => {
      state.home.unshift(action.payload);
      state.explore.unshift(action.payload);
    },
    get: (_, action) => action.payload,
    like: (state, action) => {
      const { user_id, post_id } = action.payload;

      state.home.map((post) => {
        if (post._id === post_id) {
          post.likes.user_ids.push(user_id);
          post.likes.count += 1;
        }

        return post;
      });

      state.explore.map((post) => {
        if (post._id === post_id) {
          post.likes.user_ids.push(user_id);
          post.likes.count += 1;
        }

        return post;
      });

      state.saved.map((post) => {
        if (post._id === post_id) {
          post.likes.user_ids.push(user_id);
          post.likes.count += 1;
        }

        return post;
      });
    },
    unlike: (state, action) => {
      const { user_id, post_id } = action.payload;

      state.home.map((post) => {
        if (post._id === post_id) {
          const index = post.likes.user_ids.indexOf(user_id);
          post.likes.user_ids.splice(index, 1);
          post.likes.count -= 1;
        }

        return post;
      });

      state.explore.map((post) => {
        if (post._id === post_id) {
          const index = post.likes.user_ids.indexOf(user_id);
          post.likes.user_ids.splice(index, 1);
          post.likes.count -= 1;
        }

        return post;
      });

      state.saved.map((post) => {
        if (post._id === post_id) {
          const index = post.likes.user_ids.indexOf(user_id);
          post.likes.user_ids.splice(index, 1);
          post.likes.count -= 1;
        }

        return post;
      });
    },
  },
});

const { add, get, like, unlike } = postsSlice.actions;

export function initPosts(store, post) {
  store.dispatch(get(post));
}

export function addPost(store, post) {
  store.dispatch(add(post));
}

export function likePost(store, payload) {
  store.dispatch(like(payload));
}

export function unlikePost(store, payload) {
  store.dispatch(unlike(payload));
}

export default postsSlice.reducer;
