import axios from 'axios';

export default function api() {
  return axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL,
  });
}
