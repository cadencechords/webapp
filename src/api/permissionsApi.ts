import axios from 'axios';
import type { Id, Permission } from '../types';

const PERMISSIONS_URL = import.meta.env.REACT_APP_API_URL + '/permissions';

export default class PermissionsApi {
  static getAll() {
    return axios.get<Permission[]>(PERMISSIONS_URL);
  }

  static getOne(id: Id) {
    return axios.get<Permission>(`${PERMISSIONS_URL}/${id}`);
  }
}
