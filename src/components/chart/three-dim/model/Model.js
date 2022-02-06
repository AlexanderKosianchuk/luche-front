import './model.sass';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import {
  Transforms,
  Cartesian3,
  Model,
  Math as CesiumMath,
  Color,
  JulianDate,
  TimeInterval,
  HeadingPitchRoll,
  HeadingPitchRange,
  TimeIntervalCollection,
  SampledPositionProperty,
  VelocityOrientationProperty,
  PolylineGlowMaterialProperty
} from 'cesium/Cesium';

import transmit from 'actions/transmit';

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
    timeline.forEach((item, ii) => {
      let time = JulianDate.fromDate(new Date(timeline[ii]));
      let position = Cartesian3.fromDegrees(longitude[ii],latitude[ii],altitude[ii]);
      property.addSample(time, position);
    });

    [0, Math.round(timeline.length / 2), (timeline.length - 1)]
      .forEach((ii) => {
        let position = Cartesian3.fromDegrees(longitude[ii],latitude[ii],altitude[ii]);

        this.viewer.entities.add({
          position: position,
          point: {
            pixelSize: 1,
            color: Color.TRANSPARENT,
            outlineColor: Color.YELLOW,
            outlineWidth: 1
          }
        });
      });

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

  putModel(index = 0) {
    if (this.couldPutModel() && !this.model) {
      /*
      let modelMatrix = Cartesian3.fromDegrees(
        this.props.longitude[index],
        this.props.latitude[index],
        this.props.altitude[index]
      );

      let hpr = new HeadingPitchRoll(
        Math.toRadians(this.props.yaw[index]),
        this.props.pitch[index],
        this.props.roll[index]
      );
      let hpr = new HeadingPitchRoll(
        CesiumMath.toRadians(this.props.yaw[index]),
        0,
        0
      );
      let orientation = Transforms.headingPitchRollQuaternion(modelMatrix, hpr);*/
      let position = this.setPath();

      this.model = this.viewer.entities.add({
        availability: new TimeIntervalCollection([new TimeInterval({
            start: this.start,
            stop: this.stop
        })]),
        position: position,
        orientation: new VelocityOrientationProperty(position),
        model: {
          uri: '/src/static/models/CesiumAir/Cesium_Air.glb',
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

  handle() {
    if (!this.model) {
      return;
    }

    if (this.props.trackingEntityState) {
      this.viewer.trackedEntity = undefined;
      this.viewer.zoomTo(this.viewer.entities, new HeadingPitchRange(0, CesiumMath.toRadians(-90)));
    } else {
      this.viewer.trackedEntity = this.model;
    }

    this.props.transmit('SET_FLIGHT_GEO_TRACKING_ENTITY_TYPE', {
      trackingEntityState: !this.props.trackingEntityState
    });
  }

  render() {
    let btnText = this.props.trackingEntityState
      ? I18n.t('chart.threeDim.model.freeCamera')
      : I18n.t('chart.threeDim.model.follow');

    return (
      <div className='chart-three-dim-model'>
        <div
          className='chart-three-dim-model__tracked-entity-btn'
          onClick={ this.handle.bind(this) }
        >
          { btnText }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.realtimePlayback.status,
    timestamp: state.realtimePlayback.timestamp,
    trackingEntityState: state.realtimePlayback.trackingEntityState,
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
  return {
    transmit: bindActionCreators(transmit, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimModel);
