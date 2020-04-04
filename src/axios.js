import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3030/api/"
});

export default instance;
