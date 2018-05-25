import './three-dim-toggle.sass';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import transmit from 'actions/transmit';

class ThreeDimToggle extends Component {
  handleClick(event) {
    this.props.transmit('SET_FLIGHT_GEO_DISPLAY_STATE', {
      isDisplayed: !this.props.isDisplayed
    });
  }

  render() {
    if (this.props.hasCoordinates !== true) {
      return null;
    }

    return (
      <ul className='three-dim-toggle nav navbar-nav navbar-right'>
        <li><a href='#' onClick={ this.handleClick.bind(this) }>
          <span
            className='glyphicon glyphicon-globe'
            aria-hidden='true'
          >
            <span className={
                this.props.isDisplayed ? 'three-dim-toggle__strikethrough' : ''
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
    isDisplayed: state.realtimePlayback.isDisplayed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    transmit: bindActionCreators(transmit, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimToggle);
