import axios from "axios";

const GitHub: any = axios.create({
  baseURL: "https://api.github.com",
  responseType: "json",
});

export const getHeaders: any = () => {
  return {
    "Content-Type": "application/json",
  };
};

export default GitHub;
