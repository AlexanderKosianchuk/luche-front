const initialState = {
  config: {
    interactionUrl: 'http://localhost:1337'
  }
};

export default function appConfig(state = initialState, action) {
  switch (action.type) {
    case 'APP_CONFIG_SET':
      return {
        config: action.payload.config
      };
    default:
      return state;
  }
}
