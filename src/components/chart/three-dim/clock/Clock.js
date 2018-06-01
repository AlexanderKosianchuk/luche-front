import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _throttle from 'lodash.throttle';

import {
  knockout,
  Cartesian3,
  Math,
  JulianDate,
  ClockRange
} from 'cesium/Cesium';

import transmit from 'actions/transmit';

class Clock extends Component {
  constructor(props) {
    super(props);

    this.isAnimating = null;
    this.handleTick = this.onTick.bind(this);
    this.handleAnimationStateChange = this.onAnimationStateChange.bind(this);
    this.handleTimelineScrub = this.onTimelineScrub.bind(this);
    this.goToTimestampThrottle = _throttle(this.goToTimestamp.bind(this), 1000);

    props.subjectViewer.subscribe({
      next: (cesiumViewer) => {
        if (cesiumViewer !== null) {
          this.viewer = cesiumViewer;

          this.timestamp = new Date(JulianDate.toDate(this.viewer.clock.currentTime)).getTime();
          this.viewer.clock.onTick.addEventListener(this.handleTick);

          this.shouldAnimateObserver = knockout.getObservable(
            this.viewer.clockViewModel,
            'shouldAnimate'
          ).subscribe(this.handleAnimationStateChange);

          this.viewer.timeline.addEventListener(
            'settime',
            this.handleTimelineScrub,
            false
          );
        }
      }
    });
  }

  onTimelineScrub(event) {
    let timestamp = new Date(JulianDate.toDate(event.clock.currentTime)).getTime();
    this.timestamp = timestamp;
    this.goToTimestampThrottle();
  }

  onAnimationStateChange(isAnimating) {
    this.isAnimating = isAnimating;

    this.props.transmit('SET_FLIGHT_GEO_FLY_STATE', {
      status: isAnimating ? 'flying' : 'mute'
    });
  }

  onTick(clock) {
    if (!this.isAnimating) {
      return;
    }

    let timestamp = new Date(JulianDate.toDate(clock.currentTime)).getTime();

    if ((this.props.status !== 'mute') && (this.timestamp !== timestamp)) {
      this.goToTimestampThrottle();
    }

    this.timestamp = timestamp;
  }

  goToTimestamp() {
    this.props.transmit('FLIGHT_GEO_FLY', {
      status: 'flying',
      timestamp: this.timestamp
    });
  }

  setTimelineBoundary(timeline) {
    if ((timeline.length > 0)
      && ((this.start !== JulianDate.fromDate(new Date(timeline[0])))
        || (this.stop !== JulianDate.fromDate(new Date(timeline[timeline.length - 1])))
        )
    ) {
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

    this.viewer.timeline.container.onmouseup = (e) => {
      this.goToTimestamp(new Date(JulianDate.toDate(this.viewer.clock.currentTime)).getTime());
    }

    this.viewer.timeline.container.ontouchend = (e) => {
      this.goToTimestamp(new Date(JulianDate.toDate(this.viewer.clock.currentTime)).getTime());
    }
  }

  componentDidMount() {
    this.setTimelineBoundary(this.props.timeline);
  }

  componentDidUpdate() {
    this.setTimelineBoundary(this.props.timeline);
  }

  shouldComponentUpdate(nextProps) {
    if ((this.props.timeline.length !== nextProps.timeline.length)
      || (this.props.isDisplayed !== nextProps.isDisplayed)
    ) {
      this.setTimelineBoundary(nextProps.timeline);
    }

    return false;
  }

  componentWillUnmount() {
    if (this.viewer) {
      this.viewer.clock.onTick.removeEventListener(this.handleTick);
      this.viewer.timeline.removeEventListener(this.handleTimelineScrub);
    }

    if (this.shouldAnimateObserver) {
      this.shouldAnimateObserver.dispose();
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    status: state.realtimePlayback.status,
    isDisplayed: state.realtimePlayback.isDisplayed,
    timeline: state.realtimePlayback.timeline,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    transmit: bindActionCreators(transmit, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Clock);
