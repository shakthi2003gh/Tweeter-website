import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    login: (_, action) => action.payload,
    logout: () => ({}),
  },
});

const { login, logout } = userSlice.actions;

export function AddUser(store, user) {
  store.dispatch(login(user));
}

export function removeUser(store) {
  store.dispatch(logout());
}

export default userSlice.reducer;
