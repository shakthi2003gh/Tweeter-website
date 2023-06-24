import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    login: (_, action) => action.payload,
    logout: () => ({}),
    update: (_, action) => action.payload,
    follow: (state, action) => {
      state.following.user_ids.push(action.payload);
      state.following.count++;
    },
    unfollow: (state, action) => {
      const ids = state.following.user_ids;
      state.following.user_ids = ids.filter((id) => id !== action.payload);
      state.following.count--;
    },
  },
});

const { login, logout, update, follow, unfollow } = userSlice.actions;

export function AddUser(store, user) {
  store.dispatch(login(user));
}

export function removeUser(store) {
  store.dispatch(logout());
}
export function updateUser(store, user) {
  store.dispatch(update(user));
}

export function followUser(store, id) {
  store.dispatch(follow(id));
}

export function unFollowUser(store, id) {
  store.dispatch(unfollow(id));
}

export default userSlice.reducer;
