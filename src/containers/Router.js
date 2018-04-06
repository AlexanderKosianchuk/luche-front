import React, { Component } from 'react'
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { ConnectedRouter, routerActions } from 'react-router-redux';

import Login from 'containers/login/Login';
import Results from 'containers/results/Results';
import FlightsTree from 'containers/flights-tree/FlightsTree';
import FlightsTable from 'containers/flights-table/FlightsTable';
import Settings from 'containers/settings/Settings';
import Calibrations from 'containers/calibrations/Calibrations';
import CalibrationForm from 'containers/calibration-form/CalibrationForm';
import RealTimeCalibration from 'containers/realtime-calibration/RealTimeCalibration';
import UsersTable from 'containers/users-table/UsersTable';
import UserActivity from 'containers/user-activity/UserActivity';
import UserForm from 'containers/user-form/UserForm';
import FlightEvents from 'containers/flight-events/FlightEvents';
import FlightTemplates from 'containers/flight-templates/FlightTemplates';
import FlightTemplateCreate from 'containers/flight-template-create/FlightTemplateCreate';
import FlightTemplateUpdate from 'containers/flight-template-update/FlightTemplateUpdate';
import FlightParams from 'containers/flight-params/FlightParams';
import UploadingPreview from 'containers/uploading-preview/UploadingPreview';
import Chart from 'containers/chart/Chart';

class Router extends Component {
  constructor(props) {
    super (props);

    this.routes = [
      { isExact: false, path: '/login', component: Login },
      { isExact: true, path: '/', component: FlightsTree },
      { isExact: false, path: '/flights/tree', component: FlightsTree },
      { isExact: false, path: '/flights/table', component: FlightsTable },
      { isExact: false, path: '/user-settings', component: Settings },
      { isExact: false, path: '/results', component: Results },

      { isExact: true, path: '/calibrations/fdr-id/:fdrId/page/:page/page-size/:pageSize', component: Calibrations },
      { isExact: true, path: '/calibrations/fdr-id/:fdrId/page/:page', component: Calibrations },
      { isExact: true, path: '/calibrations/page/:page/page-size/:pageSize', component: Calibrations },
      { isExact: true, path: '/calibrations/fdr-id/:fdrId/page/:page', component: Calibrations },
      { isExact: true, path: '/calibrations/fdr-id/:fdrId', component: Calibrations },
      { isExact: true, path: '/calibrations', component: Calibrations },

      { isExact: true, path: '/calibration/update/:calibrationId', component: CalibrationForm },
      { isExact: true, path: '/calibration/create/fdr-id/:fdrId', component: CalibrationForm },
      { isExact: true, path: '/realtime-calibration/fdr-id/:fdrId/params-sourse/:paramsSource/fdr-template-id/:fdrTemplateId', component: RealTimeCalibration },
      { isExact: true, path: '/realtime-calibration/fdr-id/:fdrId/params-sourse/:paramsSource/', component: RealTimeCalibration },
      { isExact: true, path: '/realtime-calibration/fdr-id/:fdrId/', component: RealTimeCalibration },
      { isExact: true, path: '/realtime-calibration/', component: RealTimeCalibration },

      { isExact: true, path: '/users', component: UsersTable },
      { isExact: true, path: '/user/create/', component: UserForm },
      { isExact: true, path: '/user/:type/:userId', component: UserForm },
      { isExact: true, path: '/user-activity/:userId/page/:page/page-size/:pageSize', component: UserActivity },
      { isExact: true, path: '/user-activity/:userId/page/:page', component: UserActivity },
      { isExact: true, path: '/user-activity/:userId', component: UserActivity },

      { isExact: false, path: '/flight-events/:flightId', component: FlightEvents },
      { isExact: true, path: '/flight-templates/:flightId', component: FlightTemplates },
      { isExact: false, path: '/flight-template-edit/create/flight-id/:flightId/', component: FlightTemplateCreate },
      { isExact: false, path: '/flight-template-edit/update/flight-id/:flightId/template-id/:templateId', component: FlightTemplateUpdate },
      { isExact: false, path: '/flight-params/:id', component: FlightParams },
      { isExact: true, path: '/uploading/:uploadingUid/fdr-id/:fdrId', component: UploadingPreview },
      { isExact: false, path: '/uploading/:uploadingUid/fdr-id/:fdrId/calibration-id/:calibrationId', component: UploadingPreview },
      { isExact: false, path: '/chart/flight-id/:flightId/template-id/:templateId/from-frame/:fromFrame/to-frame/:toFrame', component: Chart }
    ];
  }

  componentWillUpdate() {
    // TODO: check if none pass and render NotFound
  }

  render() {
    return (<ConnectedRouter history={ this.props.history }><div>
        { this.routes.map((item, key) => {
          if (item.isExact) {
            return <Route exact path={ item.path } component={ item.component } key={ key } />
          }

          return <Route path={ item.path } component={ item.component } key={ key }/>
        }) }
      </div></ConnectedRouter>
    )
  }
};

function mapStateToProps(state) {
  return {
    location: state.router.location
  };
}

export default connect(mapStateToProps, () => { return {} })(Router);
