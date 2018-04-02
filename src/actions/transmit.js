export default function transmit(event, payload = {}, rawDispatch = false) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      if (rawDispatch) {
        dispatch({
          type: event,
          payload: payload
        });
      } else {
        dispatch(payload);
      }

      resolve(payload);
    });
  }
};
