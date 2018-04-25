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
  componentWillUpdate() {
    let modelMatrix = Transforms.eastNorthUpToFixedFrame(
      Cartesian3.fromDegrees(
        -75.62898254394531 + this.props.frameNum * 0.1,
        40.02804946899414 + this.props.frameNum * 0.1,
        0.0 + this.props.frameNum * 1000)
    );

    this.model.modelMatrix = modelMatrix;

    console.log(this.model.modelMatrix);
  }

  constructor(props) {
    super(props);

    props.subjectViewer.subscribe({
      next: (cesiumViewer) => {
        if (cesiumViewer !== null) {
          this.putModel(cesiumViewer);
        }
      }
    });
  }

  putModel(viewer) {
    if (viewer !== null) {
      let modelMatrix = Transforms.eastNorthUpToFixedFrame(
        Cartesian3.fromDegrees(-75.62898254394531, 40.02804946899414, 0.0)
      );

      this.model = viewer.scene.primitives.add(Model.fromGltf({
        url : REST_URL + 'models/CesiumMilkTruck.gltf',
        modelMatrix : modelMatrix,
        scale : 200000.0
      }));
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    status: state.realtimePlayback.status,
    frameNum: state.realtimePlayback.frameNum
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimCesiumModel);
