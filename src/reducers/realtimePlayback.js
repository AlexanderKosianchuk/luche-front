const initialState = {
  status: null,
  flightId: null,
  frameNum: null,
  step: 1,
  timestamp: null,
  thresholdBinded: false,
  trackingEntityState: true,
  isDisplayed: true,
  timeline: [],
  latitude: [],
  longitude: [],
  altitude: [],
  yaw: [],
  pitch: [],
  roll: [],
  modelUrl: null
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
      let step = 1;
      if (action.payload.response.timeline.length > 1) {
        let timelineStep = action.payload.response.timeline[1] -
          action.payload.response.timeline[0];
        step = 1000 / timelineStep; // should get 1 second
      }

      return { ...state,
        ...{
          flightId: action.payload.request.flightId,
          status: 'ready',
          frameNum: 0,
          step: step,
          timestamp: (action.payload.response.timeline
              && action.payload.response.timeline.length > 0)
            ? action.payload.response.timeline[0]
            : 0,
          thresholdBinded: true,
          isDisplayed: true,
          timeline: action.payload.response.timeline,
          latitude: action.payload.response.latitude,
          longitude: action.payload.response.longitude,
          altitude: action.payload.response.altitude,
          yaw: action.payload.response.yaw,
          pitch: action.payload.response.pitch,
          roll: action.payload.response.roll,
          modelUrl: action.payload.response.modelUrl
        }
      };

    case 'FLIGHT_GEO_FLY':
      if (action.payload.frameNum
        && state.timeline[action.payload.frameNum]
      ) {
        return { ...state,
          ...{
            status: action.payload.state || state.status,
            frameNum: action.payload.frameNum,
            timestamp: state.timeline[action.payload.frameNum],
          }
        };
      }

      if (action.payload.timestamp) {
        if (action.payload.timestamp <= state.timeline[0]) {
          return { ...state,
            ...{
              status: action.payload.state || state.status,
              frameNum: 0,
              timestamp: state.timeline[0]
            }
          };
        }

        if (action.payload.timestamp >= state.timeline[state.timeline.length - 1]) {
          return { ...state,
            ...{
              status: action.payload.state || state.status,
              frameNum: state.timeline.length - 1,
              timestamp: state.timeline[state.timeline.length - 1]
            }
          };
        }

        let index = 0;
        let previousValue = state.timeline[index];
        for (index in state.timeline) {
          let currentValue = state.timeline[index];

          if ((previousValue <= action.payload.timestamp)
            && (currentValue > action.payload.timestamp)
          ) {
            break;
          }

          previousValue = currentValue;
        }

        return { ...state,
          ...{
            status: action.payload.state || state.status,
            frameNum: parseInt(index),
            timestamp: state.timeline[index]
          }
        };
      }

      if ((state.frameNum < 0)
        || (state.frameNum > state.timeline.length)
      ) {
        return { ...state,
          ...{
            status: action.payload.state || state.status,
            frameNum: 0,
            timestamp: state.timeline[0]
          }
        };
      }

      return { ...state,
        ...{
          status: action.payload.state || state.status,
          frameNum: state.frameNum + state.step,
          timestamp: state.timeline[state.frameNum + 1]
        }
      };
    case 'SET_FLIGHT_GEO_FLY_STATE':
      return { ...state,
        ...{
          status: action.payload.state,
        }
      };
    case 'SET_FLIGHT_GEO_THRESHOLD_STATE':
      return { ...state,
        ...{
          thresholdBinded: action.payload.state,
        }
      };
    case 'SET_FLIGHT_GEO_DISPLAY_STATE':
      return { ...state,
        ...{
          isDisplayed: action.payload.isDisplayed,
        }
      };
    case 'SET_FLIGHT_GEO_TRACKING_ENTITY_TYPE':
      return { ...state,
        ...{
          trackingEntityState: action.payload.trackingEntityState,
        }
      };
    default:
      return state;
  }
}
