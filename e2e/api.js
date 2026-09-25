// Calls the API from inside a page that is on the app origin, with the
// session's own auth headers. team_id is added to the query and the body.
const API_URL = process.env.REACT_APP_API_URL;

function api(page, method, path, body) {
  return page.evaluate(
    async ({ apiUrl, method, path, body }) => {
      const team = localStorage.getItem('teamId');
      const url = `${apiUrl}${path}${path.includes('?') ? '&' : '?'}team_id=${team}`;
      const res = await fetch(url, {
        method,
        headers: {
          'content-type': 'application/json',
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client'),
          uid: localStorage.getItem('uid'),
        },
        body: body && JSON.stringify({ ...body, team_id: team }),
      });
      if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}`);
      return res.status === 204 ? null : res.json().catch(() => null);
    },
    { apiUrl: API_URL, method, path, body }
  );
}

module.exports = { api };
