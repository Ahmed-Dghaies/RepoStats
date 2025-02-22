import axios from "axios";

const githubAPI = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
});

export { githubAPI };
