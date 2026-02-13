import axios from "axios";

const api = axios.create({
  baseURL: "https://realtimechatapp-j9ri0.sevalla.app/api",
  withCredentials: true,
});

export default api;
