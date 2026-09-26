import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
import type { AnnotationPath, Id } from '../types';

export default class AnnotationsApi {
  static createBulk(annotations: AnnotationPath[], songId: Id) {
    return api().post<AnnotationPath[]>(
      `/songs/${songId}/annotations?team_id=${getTeamId()}`,
      { annotations },
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static deleteBulk(annotationIds: Id[], songId: Id) {
    const requestParams = annotationIds
      .map(annotationId => `annotation_ids[]=${annotationId}`)
      .join('&');

    return api().delete<unknown>(
      `/songs/${songId}/annotations?team_id=${getTeamId()}&${requestParams}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
