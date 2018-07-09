const initialState = {
  pending: null,
  items: [],
  chosen: null
};

export default function calibration(state = initialState, action) {
  let items = [];

  switch (action.type) {
    case 'GET_CALIBRATIONS_START':
      return { ...state,
        ...{ pending: true }
      };
    case 'GET_CALIBRATIONS_COMPLETE':
      if (state.pending !== true) {
        return state;
      }

      return { ...state, ...{
        pending: false,
        items: action.payload.response,
        chosen: action.payload.response[0] || {}
      }};
    case 'SET_CHOSEN_CALIBRATION':
      return { ...state, ...{
        pending: false,
        chosen: action.payload.chosen || null
      }};
    case 'POST_DELETE_CALIBRATION_COMPLETE':
      let deleteId = action.payload.request.calibrationId;
      let deleteIndex = state.items.findIndex((item) => (item.id === deleteId));
      items = state.items.slice();
      items.splice(deleteIndex, 1);

      return { ...state, ...{
        items: items
      }};
    case 'POST_CREATE_CALIBRATION_COMPLETE':
      let newItem = action.payload.response;
      items = state.items.slice();
      items.push(newItem);

      return { ...state, ...{
        items: items
      }};
    case 'POST_UPDATE_CALIBRATION_COMPLETE':
      let updatedId = action.payload.request.calibrationId;
      let updatedIndex = state.items.findIndex((item) => (item.id === updatedId));
      items = state.items.slice();
      items.splice(updatedIndex, 1);

      let updatedItem = action.payload.response;
      items.push(updatedItem);

      return { ...state, ...{
        items: items
      }};
    default:
      return state;
  }
}
