import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Cartesian3 } from 'cesium/Cesium';

import transmit from 'actions/transmit';

class ThreeDimCesiumClock extends Component {
  constructor(props) {
    super(props);

    props.subjectViewer.subscribe({
      next: (cesiumViewer) => {
        if (cesiumViewer !== null) {
          this.viewer = cesiumViewer;
        }
      }
    });

    this.handler = this.onTick.bind(this);
  }

  onTick(clock) {
    this.props.transmit('FLIGHT_GEO_FLY', { state: 'flying'});
  }

  shouldComponentUpdate(nextProps) {
    if ((this.props.status !== 'flying')
      && (nextProps.status  === 'flying')
      && this.viewer.clock
    ) {
      this.viewer.clock.onTick.addEventListener(this.handler);
    }

    if ((this.props.status === 'flying')
      && (nextProps.status !== 'flying')
      && this.viewer.clock
    ) {
      this.viewer.clock.onTick.removeEventListener(this.handler);
    }

    return false;
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    status: state.realtimePlayback.status
  };
}

function mapDispatchToProps(dispatch) {
  return {
    transmit: bindActionCreators(transmit, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimCesiumClock);
