import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Cartesian3,
  Math,
  JulianDate,
  ClockRange
} from 'cesium/Cesium';

import transmit from 'actions/transmit';

class Clock extends Component {
  constructor(props) {
    super(props);

    props.subjectViewer.subscribe({
      next: (cesiumViewer) => {
        if (cesiumViewer !== null) {
          this.viewer = cesiumViewer;

          Math.setRandomNumberSeed(3);
        }
      }
    });

    this.handler = this.onTick.bind(this);
  }

  onTick(clock) {
    console.log(1);
    this.props.transmit('FLIGHT_GEO_FLY', { state: 'flying'});
  }

  setTimelineBoundary(timeline) {
    if (timeline.length > 0) {
      this.start = JulianDate.fromDate(new Date(timeline[0]));
      this.stop = JulianDate.fromDate(new Date(timeline[timeline.length - 1]));

      let clock = this.viewer.clock;
      clock.startTime = this.start.clone();
      clock.stopTime = this.stop.clone();
      clock.currentTime = this.start.clone();
      clock.clockRange = ClockRange.LOOP_STOP;
      clock.multiplier = 1;
      this.viewer.timeline.zoomTo(this.start, this.stop);
    }
      console.log(new Date(JulianDate.toDate(this.viewer.clock.currentTime)).getTime());

      this.viewer.timeline.container.onmouseup = (e) => {
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.timeline.length !== nextProps.timeline.length) {
      this.setTimelineBoundary(nextProps.timeline);
    }

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
    status: state.realtimePlayback.status,
    timeline: state.realtimePlayback.timeline,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    transmit: bindActionCreators(transmit, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Clock);
