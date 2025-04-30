import axios from "axios";

const backendApi: any = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

export default backendApi;
