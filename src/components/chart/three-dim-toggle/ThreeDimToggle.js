import './three-dim-toggle.sass';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import trigger from 'actions/trigger';

class ThreeDimToggle extends Component {
  handleClick(event) {
    this.props.toggleThreeDimIsShown();
    this.props.trigger('toggleThreeDimIsShown');
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
                this.props.threeDimIsShown ? 'three-dim-toggle__strikethrough' : ''
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
    hasCoordinates: state.flight.hasCoordinates
  };
}

function mapDispatchToProps(dispatch) {
  return {
    trigger: bindActionCreators(trigger, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimToggle);
