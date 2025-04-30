import axios from "axios";

const githubAPI = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

githubAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 500;
    const message = error.response?.statusText ?? "Internal Server Error";

    return Promise.reject(Object.assign(new Error(message), { status }));
  }
);

export { githubAPI };
