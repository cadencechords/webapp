import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
export default class AnnotationsApi {
  static createBulk(annotations, songId) {
    return api().post(
      `/songs/${songId}/annotations?team_id=${getTeamId()}`,
      { annotations },
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static deleteBulk(annotationIds, songId) {
    let requestParams = annotationIds
      .map(annotationId => `annotation_ids[]=${annotationId}`)
      .join('&');

    return api().delete(
      `/songs/${songId}/annotations?team_id=${getTeamId()}&${requestParams}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
