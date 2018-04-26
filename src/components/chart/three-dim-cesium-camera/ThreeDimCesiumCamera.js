import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Cartesian3
} from 'cesium/Cesium';

class ThreeDimCesiumCamera extends Component {
  constructor(props) {
    super(props);

    props.subjectViewer.subscribe({
      next: (cesiumViewer) => {
        if (cesiumViewer !== null) {
          this.viewer = cesiumViewer;

          this.putCamera(0);
        }
      }
    });
  }

  componentDidUpdate() {
    this.putCamera(this.props.frameNum);
  }

  couldPutCamera (frameNum) {
    if ((this.viewer !== null)
      && this.props.latitude
      && this.props.longitude
      && this.props.altitude
      && (this.props.latitude.length > 0)
      && (this.props.longitude.length > 0)
      && (this.props.altitude.length > 0)
      && this.props.latitude[frameNum] != undefined
      && this.props.longitude[frameNum] != undefined
      && this.props.altitude[frameNum] != undefined
    ) {
      return true;
    }

    return false;
  }

  putCamera(frameNum) {
    if (this.couldPutCamera(frameNum)) {
      var direction = Cartesian3.UNIT_Y.clone();
      var up = Cartesian3.UNIT_Z.clone();

      /*up.x = 100;
      up.y = 1000;
      up.z = 10000;

      // initial position and orientation
      this.viewer.camera.position = new Cartesian3(
        this.props.latitude[0],
        this.props.longitude[0],
        this.props.altitude[0]
      );
      this.viewer.camera.setView({
        orientation: {
          direction: direction,
          up: up
      }});*/

      console.log(this.viewer.camera.position);
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    status: state.realtimePlayback.status,
    frameNum: state.realtimePlayback.frameNum,
    timeline: state.realtimePlayback.timeline,
    latitude: state.realtimePlayback.latitude,
    longitude: state.realtimePlayback.longitude,
    altitude: state.realtimePlayback.altitude,
    yaw: state.realtimePlayback.yaw,
    pitch: state.realtimePlayback.pitch,
    roll: state.realtimePlayback.roll
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimCesiumCamera);
