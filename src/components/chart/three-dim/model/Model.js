import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Transforms,
  Cartesian3,
  Model,
  Math as CesiumMath,
  Color,
  JulianDate,
  TimeInterval,
  HeadingPitchRoll,
  TimeIntervalCollection,
  SampledPositionProperty,
  VelocityOrientationProperty,
  PolylineGlowMaterialProperty
} from 'cesium/Cesium';

class ThreeDimModel extends Component {
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
    this.putModel();
  }

  componentDidUpdate() {
    this.putModel();
  }

  setPath () {
    const timeline = this.props.timeline;
    const latitude = this.props.latitude;
    const longitude = this.props.longitude;
    const altitude = this.props.altitude;

    this.start = JulianDate.fromDate(new Date(timeline[0]));
    this.stop = JulianDate.fromDate(new Date(timeline[timeline.length - 1]));

    let property = new SampledPositionProperty();
    for (let ii = 0; ii <= timeline.length; ii += 10) {
        var time = JulianDate.fromDate(new Date(timeline[ii]));
        var position = Cartesian3.fromDegrees(
            longitude[ii],
            latitude[ii],
            altitude[ii]
        );
        property.addSample(time, position);

        this.viewer.entities.add({
          position: position,
          point: {
            pixelSize: 1,
            color: Color.TRANSPARENT,
            outlineColor: Color.YELLOW,
            outlineWidth: 1
          }
        });
    }

    return property;
  }

  couldPutModel () {
    if ((this.viewer !== null)
      && (this.props.timeline.length > 0)
    ) {
      return true;
    }

    return false;
  }

  putModel(frameNum) {
    if (this.couldPutModel() && !this.model) {
      /*
      let modelMatrix = Cartesian3.fromDegrees(
        this.props.longitude[frameNum],
        this.props.latitude[frameNum],
        this.props.altitude[frameNum]
      );

      let hpr = new HeadingPitchRoll(
        Math.toRadians(this.props.yaw[frameNum]),
        this.props.pitch[frameNum],
        this.props.roll[frameNum]
      );
      let hpr = new HeadingPitchRoll(
        CesiumMath.toRadians(this.props.yaw[frameNum]),
        0,
        0
      );
      let orientation = Transforms.headingPitchRollQuaternion(modelMatrix, hpr);*/
      let position = this.setPath();

      this.model = this.viewer.entities.add({
        name: 'Aircraft',
        availability: new TimeIntervalCollection([new TimeInterval({
            start: this.start,
            stop: this.stop
        })]),
        position: position,
        orientation: new VelocityOrientationProperty(position),
        model: {
          uri: REST_URL + this.props.modelUrl,
          minimumPixelSize: 100,
          maximumScale: 100
        },
        path: {
          resolution: 1,
          material: new PolylineGlowMaterialProperty({
            glowPower: 0.1,
            color: Color.YELLOW
          }),
          width: 1
        }
      });
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
    roll: state.realtimePlayback.roll,
    modelUrl: state.realtimePlayback.modelUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimModel);
