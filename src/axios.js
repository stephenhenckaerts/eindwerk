import axios from "axios";

const instance = axios.create({
  baseURL: "https://percelen-9c13a.firebaseio.com/"
});

export default instance;
