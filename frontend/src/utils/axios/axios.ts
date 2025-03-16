import axios from "axios";

const backendApi: any = axios.create({
  baseURL: "http://localhost:3000",
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

export default backendApi;
