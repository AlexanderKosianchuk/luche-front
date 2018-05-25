import 'cesium/Widgets/widgets.css';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  MapboxImageryProvider,
  Credit,
  Viewer,
} from 'cesium/Cesium';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGVkYW5hYW4wMCIsImEiOiJjamc2bDBnNjAxMmY3MnpzMG9sdnVsMGhsIn0.qAgylJX9eHK0n9ni6rUkKg';

class ThreeDimViewer extends Component {
  componentDidMount() {
    this.create();
  }

  create() {
    if (this.viewer) {
      return;
    }

    // Mapbox tile provider
    let mapbox = new MapboxImageryProvider({
        mapId: 'mapbox.streets-satellite',
        accessToken: MAPBOX_ACCESS_TOKEN
    });

    this.viewer = new Viewer('cesiumContainer', {
      shouldAnimate: false,
      imageryProvider: mapbox,
      baseLayerPicker: false,
      animation: true,
      geocoder: false,
      homeButton: false,
      fullscreenButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
    });

    this.props.setCesiumViewer(this.viewer);
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.isDisplayed) {
      this.viewer.shouldAnimate = false;
    }

    return false;
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    idDisplayed: state.realtimePlayback.idDisplayed,
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimViewer);
