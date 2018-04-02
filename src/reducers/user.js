let initialState = {
  pending: null,
  login: null,
  role: 'user',
  lang: 'en'
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'GET_USER_START': {
      return {
        ...state,
        ...{ pending: true }
      };
    }
    case 'GET_USER_COMPLETE': {
      return {
        pending: false,
        login: action.payload.response.login,
        role: action.payload.response.role,
        lang: action.payload.response.lang
      };
    }
    case 'POST_USER_LOGIN_COMPLETE': {
      return {
        pending: false,
        login: action.payload.response.login,
        role: action.payload.response.role,
        lang: action.payload.response.lang
      };
    }
    case 'PUT_LANGUAGE_COMPLETE': {
      let pl = action.payload;
      if (pl.lang && state.lang !== pl.lang) {
        return {
          ...state,
          ... {
            lang: pl.lang
          }
        };
      }
    }
    case 'USER_LOGGED_OUT':
      return initialState;
    default:
      return state;
  }
}
