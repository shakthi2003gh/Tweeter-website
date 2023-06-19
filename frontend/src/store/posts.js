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
  },
});

const { add, get } = postsSlice.actions;

export function addPost(store, post) {
  store.dispatch(add(post));
}

export default postsSlice.reducer;
