import './print.sass';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';

import flightDataTablePrint from 'actions/particular/flightDataTablePrint';

class Print extends React.Component {
  handleClick(event) {
    this.props.flightDataTablePrint({
      flightId: this.props.flightId,
      startFrame: this.props.startFrame,
      endFrame: this.props.endFrame,
      params: this.props.params || [],
    });
  }

  render() {
    let modifyer = '';
    if (this.props.startFrame === this.props.endFrame) {
      modifyer = 'is-disabled';
    }

    return (
      <ul className={ 'chart-print nav navbar-nav navbar-right ' + modifyer }>
        <li><a href='#' onClick={ this.handleClick.bind(this) }>
          <span
            className='glyphicon glyphicon-print'
            aria-hidden='true'>
          </span>
        </a></li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    startFrame: state.flight.selectedStartFrame,
    endFrame: state.flight.selectedEndFrame,
    params: state.flightTemplate.params
  };
}

function mapDispatchToProps(dispatch) {
  return {
    flightDataTablePrint: bindActionCreators(flightDataTablePrint, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Print);
