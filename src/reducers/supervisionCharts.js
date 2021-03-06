const initialState = {
  analog: [],
  binary: [],
  grouped: []
};

export default function supervisionCharts(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_SUPERVISION_CHARTS_CHECKSTATE':
      let key = null;

      if (action.payload.type === 'ap') {
        key = 'analog';
      } else if (action.payload.type === 'bp') {
        key = 'binary';
      }

      if (key === null) {
        throw Error('Invalid key passed in supervisionParams');
      }

      let chosenParams = state[key].slice(0);

      let getIndexById = function (id, array) {
        let itemIndex = null;
        array.forEach((item, index) => {
          if (item.id === id) itemIndex = index;
        });

        return itemIndex; // or undefined
      }

      let itemIndex = getIndexById (
        action.payload.id,
        chosenParams
      );

      if ((action.payload.state === false)
        && (itemIndex !== null)
      ) {
        chosenParams.splice(itemIndex, 1);
      }

      if ((action.payload.state === true)
        && (itemIndex === null)
      ) {
        chosenParams.push(action.payload);
      }

      return { ...state,
        ...{ [key]: chosenParams }
      };
    case 'CLEAR_SUPERVISION_CHARTS':
      return initialState;
    case 'ADD_SUPERVISION_CHARTS_PARAM_TO_GROUP':
      let groupedToAdd = state.grouped.slice(0);
      groupedToAdd.push(action.payload);

      return { ...state,
        ...{ grouped: groupedToAdd }
      };
    case 'REMOVE_SUPERVISION_CHARTS_GROUP':
      let groupedWithoutRemoved = [];

      state.grouped.forEach((item, index) => {
        if (item.group !== action.payload.group) {
          groupedWithoutRemoved.push(item);
        }
      });

      return { ...state,
        ...{ grouped: groupedWithoutRemoved }
      };
    case 'REMOVE_SUPERVISION_CHARTS_PARAM_BY_CODE':
      let indexToRemove = state.grouped.findIndex((item, index) => {
        return (item.code === action.payload.code)
          && (item.group === action.payload.group);
      });

      if (indexToRemove > -1) {
        state.grouped.splice(indexToRemove, 1)
      }

      return state;
    default:
      return state;
  }
}
