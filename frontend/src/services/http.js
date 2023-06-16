import axios from "axios";
import { notifyError } from "./toast";

const URL = import.meta.env.VITE_API_ENDPOINT;
const authPath = "/api/auth";
const usersPath = "/api/users";

export function createUser(payload) {
  return new Promise(async (resolve, reject) => {
    axios
      .post(URL + usersPath, payload)
      .then((res) => {
        console.log(res.data);

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

export function loginUser(payload) {
  return new Promise(async (resolve, reject) => {
    axios
      .post(URL + authPath, payload)
      .then((res) => {
        console.log(res.data);

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

export function verifyUser(token) {
  const options = { headers: { "x-tweeter-auth": token } };

  return new Promise(async (resolve, reject) => {
    axios
      .get(URL + usersPath + "/me", options)
      .then((res) => {
        console.log(res.data);

        resolve();
      })
      .catch((e) => {
        localStorage.removeItem("x-tweeter-auth");
        notifyError(e.response.data.message);
        reject(e.response.data.message);
      });
  });
}
