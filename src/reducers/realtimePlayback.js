const initialState = {
  status: null,
  flightId: null,
  frameNum: null,
  timestamp: null,
  timeline: [],
  latitude: [],
  longitude: [],
  altitude: [],
  yaw: [],
  pitch: [],
  roll: []
};

export default function realtimePlayback(state = initialState, action) {
  switch (action.type) {
    case 'GET_FLIGHT_GEO_START':
      return { ...state,
        ...{
          flightId: action.payload.flightId,
          status: 'pending'
        }
      };
    case 'GET_FLIGHT_GEO_COMPLETE':

      return { ...state,
        ...{
          flightId: action.payload.request.flightId,
          status: 'ready',
          frameNum: 0,
          timestamp: (action.payload.response.timeline
              && action.payload.response.timeline.length > 0)
            ? action.payload.response.timeline[0]
            : 0,
          timeline: action.payload.response.timeline,
          latitude: action.payload.response.latitude,
          longitude: action.payload.response.longitude,
          altitude: action.payload.response.altitude,
          yaw: action.payload.response.yaw,
          pitch: action.payload.response.pitch,
          roll: action.payload.response.roll
        }
      };

    case 'FLIGHT_GEO_FLY':
      if (state.frameNum < state.timeline.length) {
        return { ...state,
          ...{
            status: 'flying',
            frameNum: state.frameNum + 1,
            timestamp: state.timeline[state.frameNum + 1]
          }
        };
      }

      return { ...state,
        ...{
          status: 'flying',
          frameNum: 0,
          timestamp: state.timeline[0]
        }
      };

    case 'FLIGHT_GEO_FLY_MUTE':
      return { ...state,
        ...{
          status: 'mute',
        }
      };
    default:
      return state;
  }
}
