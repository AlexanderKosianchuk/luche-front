const initialState = {
  pending: null,
  avaliableParams: [],
  chosenParams: [],
  data: []
};

export default function flightStatistics(state = initialState, action) {
  switch (action.type) {
    case 'POST_FLIGHT_STATISTICS_PARAMS_START':
      return { ...state, ...{ pending: true } };
    case 'POST_FLIGHT_STATISTICS_PARAMS_COMPLETE':
      return { ...state, ...{
        pending: false,
        avaliableParams: action.payload.response.slice(), // copy array
        chosenParams: action.payload.response.slice()
      }};
    case 'CHANGE_FLIGHT_STATISTICS_PARAM_ITEM_CHECKSTATE':
      let itemIndex = state.chosenParams.findIndex((item) => {
        return action.payload.id === item;
      });

      if ((action.payload.state === false)
        && (itemIndex !== null)
      ) {
        state.chosenParams.splice(itemIndex, 1);
      }

      if ((action.payload.state === true)
        && (itemIndex === null)
      ) {
        let getItemById = function(id, array) {
          var result  = array.filter((o) => o.id == id);

          return result ? result[0] : null; // or undefined
        }

        let item = getItemById(action.payload.id, state.chosenParams);
        state.chosenParams.push(item);
      }

      return { ...state };
    case 'POST_FLIGHT_STATISTICS_VALUES_START':
      state.pending = true;
      return { ...state };
    case 'POST_FLIGHT_STATISTICS_VALUES_COMPLETE':
      if (Object.keys(action.payload.response).length === 0) {
        return { ...state };
      }

      let data = [];
      Object.keys(action.payload.response).forEach((item) => {
        data.push(action.payload.response[item]);
      })

      return {
        ...state, ...{
        pending: false,
        data: data
      }};
    default:
      return state;
  }
}
