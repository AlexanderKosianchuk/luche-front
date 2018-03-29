const initialState = {
  pending: null,
  items: [],
  expanded: null
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case 'GET_FOLDERS_START':
      return { ...state,
        ...{ pending: true }
      };
    case 'GET_FOLDERS_COMPLETE':
      return { ...state, ...{
          pending: false,
          items: action.payload.response
        }
      };
    case 'DELETE_FOLDER_COMPLETE': {
      let deletedIndex = state.items.findIndex((item) => {
        return item.id === action.payload.request.id;
      });

      if (deletedIndex !== null) {
        state.items.splice(deletedIndex, 1);
      }

      return { ...state };
    }
    case 'POST_FOLDER_COMPLETE':
      state.items.push(action.payload.response)
      return { ...state };
    case 'PUT_FOLDER_PATH_COMPLETE': {
      let movedIndex = state.items.findIndex((item) => {
        return item.id === action.payload.request.id;
      });

      if (movedIndex !== null) {
        state.items[movedIndex].parentId = action.payload.request.parentId
      }

      return { ...state };
    }
    case 'PUT_FOLDER_EXPANDING_COMPLETE':
      let toggledExpandingItem = state.items.findIndex((item) => {
        return item.id === action.payload.request.id;
      });

      if (toggledExpandingItem !== null) {
        state.items[toggledExpandingItem].expanded
          = (action.payload.request.expanded === true);
      }

      return { ...state };
    case 'PUT_FOLDER_RENAME_COMPLETE':
      let renamingItem = state.items.findIndex((item) => {
        return item.id === action.payload.request.id;
      });

      if (renamingItem !== null) {
        state.items[renamingItem].name = action.payload.request.name;
      }

      return { ...state };
    case 'FOLDER_LIST_EXPANDING_TOGGLE':
      if (typeof action.payload.expanded === 'boolean') {

        state.items.forEach((item, index) => {
          item.expanded = action.payload.expanded;
        });

        state.expanded = action.payload.expanded;
        return { ...state };
      }

      return state;
    default:
      return state;
  }
}
