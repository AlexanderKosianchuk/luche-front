import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { i18nReducer } from 'react-redux-i18n';

import appConfig from 'reducers/appConfig';
import flightFilter from 'reducers/flightFilter';
import settlementFilter from 'reducers/settlementFilter';
import settlementsReport from 'reducers/settlementsReport';
import fdrs from 'reducers/fdrs';
import flight from 'reducers/flight';
import flights from 'reducers/flights';
import folders from 'reducers/folders';
import fdrCyclo from 'reducers/fdrCyclo';
import calibration from 'reducers/calibration';
import calibrations from 'reducers/calibrations';
import flightUploadingState from 'reducers/flightUploadingState';
import realtimeCalibrationData from 'reducers/realtimeCalibrationData';
import realtimeCalibrationParams from 'reducers/realtimeCalibrationParams';
import realtimeCalibrationCharts from 'reducers/realtimeCalibrationCharts';
import webSockets from 'reducers/webSockets';
import settings from 'reducers/settings';
import fdrTemplates from 'reducers/fdrTemplates';
import flightTemplate from 'reducers/flightTemplate';
import flightTemplates from 'reducers/flightTemplates';
import flightEvents from 'reducers/flightEvents';
import userReducer from 'reducers/userReducer';
import users from 'reducers/users';

const appReducer = combineReducers({
  appConfig,
  fdrs,
  flight,
  flights,
  folders,
  fdrCyclo,
  calibration,
  calibrations,
  flightUploadingState,
  realtimeCalibrationData,
  realtimeCalibrationCharts,
  realtimeCalibrationParams,
  webSockets,
  flightFilter,
  fdrTemplates,
  flightTemplate,
  flightTemplates,
  flightEvents,
  settlementFilter,
  settlementsReport,
  settings,
  router: routerReducer,
  i18n: i18nReducer,
  user: userReducer,
  users: users
});

const rootReducer = (state, action) => {
  if (action.type === 'POST_USER_LOGOUT_COMPLETE') {
    const { i18n, router } = state;
    state = { i18n, router };
  }

  return appReducer(state, action)
};


export default rootReducer;
