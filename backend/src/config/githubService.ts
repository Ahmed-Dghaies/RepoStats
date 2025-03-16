import axios from "axios";

const githubAPI = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export { githubAPI };
