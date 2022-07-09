import { constructAuthHeaders } from '../utils/AuthUtils';
import api from './api';

export default class JoinLinkApi {
  static getByJoinLinkCode(code) {
    return api().get(`/join/${code}`);
  }

  static join(code) {
    return api().post(`/join/${code}`, {}, { headers: constructAuthHeaders() });
  }
}
