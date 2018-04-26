import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Transforms,
  Cartesian3,
  Model
} from 'cesium/Cesium';

class ThreeDimCesiumModel extends Component {
  constructor(props) {
    super(props);

    props.subjectViewer.subscribe({
      next: (cesiumViewer) => {
        if (cesiumViewer !== null) {
          this.viewer = cesiumViewer;
        }
      }
    });
  }

  componentDidMount() {
    this.putModel(0);
  }

  componentDidUpdate() {
    this.putModel(this.props.frameNum);
  }

  couldPutModel (frameNum) {
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

  putModel(frameNum) {
    console.log('putModel', frameNum);
    if (this.couldPutModel(frameNum)) {
      let modelMatrix = Transforms.eastNorthUpToFixedFrame(
        Cartesian3.fromDegrees(
          this.props.longitude[frameNum],
          this.props.latitude[frameNum],
          this.props.altitude[frameNum]
        )
      );

      if (!this.model) {
        this.model = this.viewer.scene.primitives.add(Model.fromGltf({
          url : REST_URL + 'models/CesiumMilkTruck.gltf',
          modelMatrix : modelMatrix,
          minimumPixelSize : 300,
          maximumScale : 20000,
        }));
      } else {
        this.model.modelMatrix = modelMatrix;
      }

      console.log('trackedEntity');
      this.viewer.trackedEntity = this.model;
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

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimCesiumModel);
