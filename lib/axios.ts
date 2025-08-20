import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  validateStatus: () => true,
});

export default api;
