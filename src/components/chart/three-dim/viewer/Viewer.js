import 'cesium/Widgets/widgets.css';

import React, { Component } from 'react';

import {
  MapboxImageryProvider,
  Viewer,
} from 'cesium/Cesium';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGVkYW5hYW4wMCIsImEiOiJjamc2bDBnNjAxMmY3MnpzMG9sdnVsMGhsIn0.qAgylJX9eHK0n9ni6rUkKg';

export default class ThreeDimViewer extends Component {
  componentDidMount() {
    // Mapbox tile provider
    let mapbox = new MapboxImageryProvider({
        mapId: 'mapbox.streets-satellite',
        accessToken: MAPBOX_ACCESS_TOKEN
    });

    this.viewer = new Viewer('cesiumContainer', {
      shouldAnimate: true,
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

  componentWillUnmount() {
    if (this.viewer) {
      this.viewer.trackedEntity = null;
      this.viewer.destroy();
    }
  }

  render() {
    return null;
  }
}
