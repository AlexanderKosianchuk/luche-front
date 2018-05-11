import './player.sass';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import request from 'actions/request';
import transmit from 'actions/transmit';

class Player extends Component {
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

  handleClick() {
    if (this.props.status === 'flying') {
      this.props.transmit('SET_FLIGHT_GEO_FLY_STATE', { state: 'mute' });
    } else {
      this.props.transmit('SET_FLIGHT_GEO_FLY_STATE', { state: 'flying' });
    }
  }

  getIco() {
    if (this.props.status === 'flying') {
      return 'glyphicon-pause';
    }

    if ((this.props.status === 'mute')
      || (this.props.status === 'ready')
    ) {
      return 'glyphicon-play';
    }
  }

  render() {
    if (this.shouldRequestGeo()) {
      return null;
    }

    return (
      <ul className='chart-player nav navbar-nav navbar-left'>
        <li><a href='#' onClick={ this.handleClick.bind(this) }>
          <span
            className={ 'glyphicon ' + this.getIco() }
            aria-hidden='true'>
          </span>
        </a></li>
      </ul>
    );
  }
}

Player.propTypes = {
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
    request: bindActionCreators(request, dispatch),
    transmit: bindActionCreators(transmit, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
