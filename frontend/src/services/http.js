import axios from "axios";
import { notifyError } from "./toast";
import store from "../store/index";
import { AddUser, removeUser, updateUser } from "../store/user";
import { followUser, unFollowUser } from "../store/user";
import { initPosts, addPost, likePost, unlikePost } from "../store/posts";
import { commentPost } from "../store/posts";
import { savePost, unsavePost } from "../store/posts";

const URL = import.meta.env.VITE_API_ENDPOINT;
const authPath = "/api/auth";
const usersPath = "/api/users";
const postsPath = "/api/posts";

const getOptions = () => ({
  headers: {
    "x-tweeter-auth": localStorage.getItem("x-tweeter-auth"),
  },
});

export function createUser(payload) {
  return new Promise(async (resolve, reject) => {
    axios
      .post(URL + usersPath, payload)
      .then((res) => {
        AddUser(store, res.data);
        getAllPosts();

        const token = res.headers.get("x-tweeter-auth");
        localStorage.setItem("x-tweeter-auth", token);

        resolve();
      })
      .catch((e) => {
        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}

export function userUpdate(payload) {
  const options = getOptions();
  options.headers["content-type"] = "multipart/form-data";

  return new Promise(async (resolve, reject) => {
    axios
      .patch(URL + usersPath, payload, options)
      .then((res) => {
        updateUser(store, res.data);

        resolve();
      })
      .catch((e) => {
        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}

export function getUser(userId) {
  return new Promise(async (resolve, reject) => {
    axios
      .get(URL + usersPath + "/" + userId, getOptions())
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}

export function loginUser(payload) {
  return new Promise(async (resolve, reject) => {
    axios
      .post(URL + authPath, payload)
      .then((res) => {
        AddUser(store, res.data);
        getAllPosts();

        const token = res.headers.get("x-tweeter-auth");
        localStorage.setItem("x-tweeter-auth", token);

        resolve();
      })
      .catch((e) => {
        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}

export function logoutUser() {
  localStorage.removeItem("x-tweeter-auth");
  removeUser(store);
}

export function verifyUser(token) {
  const options = { headers: { "x-tweeter-auth": token } };

  return new Promise(async (resolve, reject) => {
    axios
      .get(URL + usersPath + "/me", options)
      .then((res) => {
        AddUser(store, res.data);
        getAllPosts();

        resolve();
      })
      .catch((e) => {
        removeUser(store);
        localStorage.removeItem("x-tweeter-auth");

        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}

export function createPost(post) {
  const options = getOptions();
  options.headers["content-type"] = "multipart/form-data";

  return new Promise(async (resolve, reject) => {
    axios
      .post(URL + postsPath, post, options)
      .then((res) => {
        addPost(store, res.data);

        resolve();
      })
      .catch((e) => {
        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}

export function getAllPosts() {
  return new Promise(async (resolve, reject) => {
    axios
      .get(URL + postsPath)
      .then((res) => {
        const data = res.data;
        const user = store.getState().user;
        const followings = store.getState().user.following?.user_ids || [];
        const posts = {};

        posts.home = data.filter((post) => {
          const isOwnPost = post.user._id === user._id;
          const isFollowingPost = followings.includes(post.user._id);

          return isOwnPost || isFollowingPost;
        });

        posts.explore = data;

        posts.saved = data.filter((post) =>
          user.saved_post_ids.includes(post._id)
        );

        initPosts(store, posts);
        resolve();
      })
      .catch((e) => {
        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}

export function postComment(post_id, message) {
  return new Promise(async (resolve, reject) => {
    axios
      .post(
        URL + postsPath + "/" + post_id + "/comment",
        { message },
        getOptions()
      )
      .then((res) => {
        res.data.comment._id = Date.now();
        commentPost(store, res.data);

        resolve();
      })
      .catch((e) => {
        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}

export function toggleLike(post_id, method) {
  const user = store.getState().user;

  const methods = ["like", "unlike"];
  if (!methods.includes(method)) return new Error("Method is invalid.");

  return new Promise(async (resolve, reject) => {
    axios
      .post(`${URL + postsPath}/${post_id}/${method}`, {}, getOptions())
      .then(() => {
        if (method === methods[0])
          likePost(store, { post_id, user_id: user._id });
        else unlikePost(store, { post_id, user_id: user._id });

        resolve();
      })
      .catch((e) => {
        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}

export function toggleSave(post_id, method) {
  const user = store.getState().user;

  const methods = ["save", "unsave"];
  if (!methods.includes(method)) return new Error("Method is invalid.");

  return new Promise(async (resolve, reject) => {
    axios
      .post(`${URL + postsPath}/${post_id}/${method}`, {}, getOptions())
      .then(() => {
        if (method === methods[0])
          savePost(store, { post_id, user_id: user._id });
        else unsavePost(store, { post_id, user_id: user._id });

        resolve();
      })
      .catch((e) => {
        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}

export function toggleFollow(user_id, method) {
  const methods = ["follow", "unfollow"];
  if (!methods.includes(method)) return new Error("Method is invalid.");

  return new Promise(async (resolve, reject) => {
    axios
      .post(`${URL + usersPath}/${user_id}/${method}`, {}, getOptions())
      .then(() => {
        if (method === methods[0]) followUser(store, user_id);
        else unFollowUser(store, user_id);

        resolve();
      })
      .catch((e) => {
        console.log(e);
        notifyError(e.response.data);
        reject(e.response.data);
      });
  });
}
