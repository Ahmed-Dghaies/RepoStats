import axios from "axios";

const GitHub: any = axios.create({
  baseURL: "https://api.github.com",
  responseType: "json",
});

export const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
  };
};

export default GitHub;
