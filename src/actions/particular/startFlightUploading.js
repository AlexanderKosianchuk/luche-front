export default function startFlightUploading(payload) {
  return function(dispatch) {
    dispatch({
      type: 'START_FLIGHT_UPLOADING',
      payload: {
        uploadingUid: payload.uploadingUid
      }
    });

    let checkProgress = function () {
      fetch(REST_URL+'uploader/getUploadingStatus/uploadingUid/'+payload.uploadingUid, {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then((response) => {
        try {  return response.json() }
        catch(e) {
          setTimeout(checkProgress, 1000);
        }
      })
      .then((json) => {
        if (!json) {
          return;
        }

        if (json.status === 'ok') {
          dispatch({
            type: 'FLIGHT_UPLOADING_PROGRESS_CHANGE',
            payload: {
              uploadingUid: json.uploadingUid,
              progress: json.progress
            }
          });
        }

        if (json.status !== 'complete') {
          setTimeout(checkProgress, 1000);
        }

        if (json.status === 'complete') {
          dispatch({
            type: 'FLIGHT_UPLOADING_COMPLETE',
            payload: {
              uploadingUid: payload.uploadingUid,
              item: json.item
            }
          });
        }
      });
    };

    setTimeout(checkProgress, 1000);
  }
};
