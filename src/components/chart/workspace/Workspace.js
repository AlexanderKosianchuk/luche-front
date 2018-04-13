import './workspace.sass';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ThreeDimVisualisation from 'components/chart/three-dim-visualisation/ThreeDimVisualisation';

import trigger from 'actions/trigger';
import request from 'actions/request';
import showPage from 'actions/showPage';

class Workspace extends Component {
  componentDidMount() {
    Promise.all([
      this.props.request(
        ['flightTemplate', 'get'],
        'get',
        'FLIGHT_TEMPLATE',
        {
          flightId: this.props.flightId,
          templateId: this.props.templateId
        }
      ),
      this.props.request(
        ['flights', 'getInfo'],
        'get',
        'FLIGHT',
        { flightId: this.props.flightId }
      ),
      this.props.request(
        ['users', 'getSettings'],
        'get',
        'USER_SETTINGS',
      )
    ]).then(() => {
      let params = this.props.params || [];

      let analogParamsCodes = params
        .filter((item) => (item.type === 'ap'))
        .map((item) => item.code);

      let binaryParamsCodes = params
        .filter((item) => (item.type === 'bp'))
        .map((item) => item.code);

      this.props.showPage('chartShow', [{
        flightId: this.props.flightId,
        templateId: this.props.templateId,
        stepLength: this.props.stepLength,
        startCopyTime: this.props.startFlightTime,
        startFrame: this.props.fromFrame,
        endFrame: this.props.toFrame,
        apParams: analogParamsCodes,
        bpParams: binaryParamsCodes,
        hasCoordinates: this.props.hasCoordinates
      }]);
    });
  }

  render() {
    return (
      <div className='chart-workspace'>
        { this.props.hasCoordinates &&
          (<ThreeDimVisualisation flightId={ this.props.flightId } />)
        }
        <div id='container'></div>
      </div>
    );
  }
}

Workspace.propTypes = {
  flightId: PropTypes.number.isRequired,
  templateId: PropTypes.number.isRequired,
  fromFrame: PropTypes.number.isRequired,
  toFrame: PropTypes.number.isRequired,
  params: PropTypes.array,
  stepLength: PropTypes.number,
  startFlightTime: PropTypes.string,
  hasCoordinates: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    params: state.flightTemplate.params,
    stepLength: state.flight.stepLength,
    startFlightTime: state.flight.startFlightTime,
    startFlightTime: state.flight.startFlightTime,
    settings: state.settings.items,
    hasCoordinates: state.flight.hasCoordinates
  };
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(request, dispatch),
    showPage: bindActionCreators(showPage, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
