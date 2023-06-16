import axios from "axios";

const URL = import.meta.env.VITE_API_ENDPOINT;

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
        reject(e.response.data);
      });
  });
}
