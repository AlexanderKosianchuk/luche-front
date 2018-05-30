import './workspace.sass';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ThreeDimVisualisation from 'components/chart/three-dim/visualisation/Visualisation';

import trigger from 'actions/trigger';
import request from 'actions/request';

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

      this.props.trigger('chartShow', [{
        container: '#container',
        flightId: this.props.flightId,
        templateId: this.props.templateId,
        stepLength: this.props.stepLength,
        startCopyTime: this.props.startFlightTime,
        startFrame: this.props.fromFrame,
        endFrame: this.props.toFrame,
        apParams: analogParamsCodes,
        bpParams: binaryParamsCodes,
        threeDimIsShown: (this.props.hasCoordinates && this.props.isDisplayed)
      }]);
    });
  }

  showThreeDim() {
    if (this.props.hasCoordinates) {
      return <ThreeDimVisualisation flightId={ this.props.flightId } />;
    }

    return null;
  }

  render() {
    return (
      <div className='chart-workspace'>
        { this.showThreeDim() }
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
  isDisplayed: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    params: state.flightTemplate.params,
    stepLength: state.flight.stepLength,
    startFlightTime: state.flight.startFlightTime,
    startFlightTime: state.flight.startFlightTime,
    settings: state.settings.items,
    hasCoordinates: state.flight.hasCoordinates,
    isDisplayed: state.realtimePlayback.isDisplayed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(request, dispatch),
    trigger: bindActionCreators(trigger, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
