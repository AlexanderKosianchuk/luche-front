import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import request from 'actions/request';

class DataProvider extends Component {
  componentDidMount() {
    this.requestGeo();
  }

  componentDidUpdate() {
    this.requestGeo();
  }

  requestGeo() {
    if (this.shouldRequestGeo()) {
      this.props.request(
        ['flightData', 'getGeo'],
        'get',
        'FLIGHT_GEO',
        { flightId: this.props.flightId }
      );
    }
  }

  shouldRequestGeo() {
    if (((this.props.geoFlightId !== this.props.flightId)
      || (this.props.status === null))
      && (this.props.status !== 'pending')
    ) {
      return true
    }

    return false;
  }

  render() {
    return null;
  }
}

DataProvider.propTypes = {
  flightId: PropTypes.number.isRequired,
};


function mapStateToProps(state) {
  return {
    status: state.realtimePlayback.status,
    geoFlightId: state.realtimePlayback.flightId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(request, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataProvider);
