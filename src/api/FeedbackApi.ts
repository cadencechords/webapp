import axios from 'axios';
import { constructAuthHeaders } from '../utils/AuthUtils';
import type { Id } from '../types';

const FEEDBACK_URL = import.meta.env.REACT_APP_API_URL + '/feedback';

export interface Feedback {
  team_id: Id;
  text: string;
  email: string;
  platform: string;
}

export default class FeedbackApi {
  static create(feedback: Feedback) {
    return axios.post<unknown>(FEEDBACK_URL, feedback, {
      headers: constructAuthHeaders(),
    });
  }
}
