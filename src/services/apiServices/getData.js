import axios from "axios";

export const getData = async (url, params = {}) => {
  return axios.get(url, { params });
};
