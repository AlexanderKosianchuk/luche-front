import formurlencoded from 'form-urlencoded';

export default function exportFlight(payload) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      fetch(REST_URL+'flights/export', {
        credentials: 'same-origin',
        method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; utf-8' },
        body: formurlencoded({flightIds: payload})
      }).then(response => response.json())
      .then(json => {
          dispatch({
            type: 'FLIGHTS_EXPORTED',
            payload: payload
          });
          window.location = json['zipUrl'];
          resolve();
        },
        () => reject()
      );
    });
  }
};
