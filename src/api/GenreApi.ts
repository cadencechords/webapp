import { constructAuthHeaders } from '../utils/AuthUtils';
import axios from 'axios';
import type { Tag } from '../types';

const GENRES_URL = import.meta.env.REACT_APP_API_URL + '/genres';

export default class GenreApi {
  static getAll() {
    return axios.get<Tag[]>(GENRES_URL, { headers: constructAuthHeaders() });
  }
}
