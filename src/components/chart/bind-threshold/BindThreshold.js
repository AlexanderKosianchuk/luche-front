import './bind-threshold.sass';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import transmit from 'actions/transmit';

class BindThreshold extends Component {
  handleClick(event) {
    this.props.transmit('SET_FLIGHT_GEO_THRESHOLD_STATE', {
      state: !this.props.thresholdBinded
    });
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.isDisplayed) {
      this.props.transmit('SET_FLIGHT_GEO_THRESHOLD_STATE', {
        state: false
      });
    }

    return true;
  }

  render() {
    if (this.props.hasCoordinates !== true) {
      return null;
    }

    if (!this.props.isDisplayed) {
      return null;
    }

    return (
      <ul className='chart-bind-threshold nav navbar-nav navbar-right'>
        <li><a href='#' onClick={ this.handleClick.bind(this) }>
          <span
            className='glyphicon glyphicon-link'
            aria-hidden='true'
          >
            <span className={
              this.props.thresholdBinded ? 'chart-bind-threshold__strikethrough' : ''
            }>
            </span>
          </span>
        </a></li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    hasCoordinates: state.flight.hasCoordinates,
    thresholdBinded: state.realtimePlayback.thresholdBinded,
    isDisplayed: state.realtimePlayback.isDisplayed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    transmit: bindActionCreators(transmit, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BindThreshold);
